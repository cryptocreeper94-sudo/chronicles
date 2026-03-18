/* ====== Chronicles — GLB Asset Generator ======
 * Writes GLB files directly from TrustGen recipes using a manual
 * GLB binary writer, avoiding Three.js GLTFExporter's browser dependencies.
 * Run: npx tsx scripts/generate-glbs.ts
 */
import * as fs from 'fs'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// ── Recipe types ──
interface PropNode {
    label: string; primitive: string; position: [number, number, number]
    scale: [number, number, number]; rotation?: [number, number, number]
    material: string; color?: string; children?: PropNode[]
}
interface PropRecipe {
    id: string; name: string; era: string; category: string; nodes: PropNode[]
}

// ── Material presets ──
const PRESETS: Record<string, { color: [number, number, number]; metalness: number; roughness: number }> = {
    default: { color: [0.53, 0.53, 0.53], metalness: 0, roughness: 0.5 },
    wood: { color: [0.55, 0.27, 0.07], metalness: 0, roughness: 0.85 },
    concrete: { color: [0.5, 0.5, 0.5], metalness: 0, roughness: 0.9 },
    chrome: { color: [0.75, 0.75, 0.75], metalness: 0.95, roughness: 0.15 },
    gold: { color: [1, 0.84, 0], metalness: 1, roughness: 0.1 },
    fabric: { color: [0.27, 0.51, 0.71], metalness: 0, roughness: 0.95 },
    neon: { color: [0, 1, 1], metalness: 0, roughness: 0.3 },
}

function hexToRgb(hex: string): [number, number, number] {
    const h = hex.replace('#', '')
    return [
        parseInt(h.substring(0, 2), 16) / 255,
        parseInt(h.substring(2, 4), 16) / 255,
        parseInt(h.substring(4, 6), 16) / 255,
    ]
}

// ── Geometry generators (return positions, normals, indices) ──
interface RawMesh {
    positions: number[]; normals: number[]; indices: number[]
}

function makeBox(): RawMesh {
    const p = [
        -0.5,-0.5,0.5, 0.5,-0.5,0.5, 0.5,0.5,0.5, -0.5,0.5,0.5,     // front
        -0.5,-0.5,-0.5, -0.5,0.5,-0.5, 0.5,0.5,-0.5, 0.5,-0.5,-0.5,  // back
        -0.5,0.5,-0.5, -0.5,0.5,0.5, 0.5,0.5,0.5, 0.5,0.5,-0.5,      // top
        -0.5,-0.5,-0.5, 0.5,-0.5,-0.5, 0.5,-0.5,0.5, -0.5,-0.5,0.5,  // bottom
        0.5,-0.5,-0.5, 0.5,0.5,-0.5, 0.5,0.5,0.5, 0.5,-0.5,0.5,      // right
        -0.5,-0.5,-0.5, -0.5,-0.5,0.5, -0.5,0.5,0.5, -0.5,0.5,-0.5,  // left
    ]
    const n = [
        0,0,1, 0,0,1, 0,0,1, 0,0,1,
        0,0,-1, 0,0,-1, 0,0,-1, 0,0,-1,
        0,1,0, 0,1,0, 0,1,0, 0,1,0,
        0,-1,0, 0,-1,0, 0,-1,0, 0,-1,0,
        1,0,0, 1,0,0, 1,0,0, 1,0,0,
        -1,0,0, -1,0,0, -1,0,0, -1,0,0,
    ]
    const idx: number[] = []
    for (let f = 0; f < 6; f++) { const o = f * 4; idx.push(o,o+1,o+2, o,o+2,o+3) }
    return { positions: p, normals: n, indices: idx }
}

function makeSphere(seg = 12): RawMesh {
    const p: number[] = [], n: number[] = [], idx: number[] = []
    for (let y = 0; y <= seg; y++) {
        const v = y / seg, phi = v * Math.PI
        for (let x = 0; x <= seg; x++) {
            const u = x / seg, theta = u * 2 * Math.PI
            const nx = Math.sin(phi) * Math.cos(theta)
            const ny = Math.cos(phi)
            const nz = Math.sin(phi) * Math.sin(theta)
            p.push(nx * 0.5, ny * 0.5, nz * 0.5)
            n.push(nx, ny, nz)
        }
    }
    for (let y = 0; y < seg; y++) {
        for (let x = 0; x < seg; x++) {
            const a = y * (seg + 1) + x, b = a + seg + 1
            idx.push(a, b, a + 1, b, b + 1, a + 1)
        }
    }
    return { positions: p, normals: n, indices: idx }
}

function makeCylinder(seg = 12): RawMesh {
    const p: number[] = [], n: number[] = [], idx: number[] = []
    // Side
    for (let i = 0; i <= seg; i++) {
        const a = (i / seg) * 2 * Math.PI
        const x = Math.cos(a) * 0.5, z = Math.sin(a) * 0.5
        p.push(x, -0.5, z); n.push(Math.cos(a), 0, Math.sin(a))
        p.push(x, 0.5, z); n.push(Math.cos(a), 0, Math.sin(a))
    }
    for (let i = 0; i < seg; i++) {
        const a = i * 2, b = a + 2
        idx.push(a, b, a + 1, b, b + 1, a + 1)
    }
    // Caps
    const topC = p.length / 3; p.push(0, 0.5, 0); n.push(0, 1, 0)
    for (let i = 0; i < seg; i++) {
        const a = (i / seg) * 2 * Math.PI, a2 = ((i + 1) / seg) * 2 * Math.PI
        const vi = p.length / 3
        p.push(Math.cos(a) * 0.5, 0.5, Math.sin(a) * 0.5); n.push(0, 1, 0)
        p.push(Math.cos(a2) * 0.5, 0.5, Math.sin(a2) * 0.5); n.push(0, 1, 0)
        idx.push(topC, vi, vi + 1)
    }
    const botC = p.length / 3; p.push(0, -0.5, 0); n.push(0, -1, 0)
    for (let i = 0; i < seg; i++) {
        const a = (i / seg) * 2 * Math.PI, a2 = ((i + 1) / seg) * 2 * Math.PI
        const vi = p.length / 3
        p.push(Math.cos(a2) * 0.5, -0.5, Math.sin(a2) * 0.5); n.push(0, -1, 0)
        p.push(Math.cos(a) * 0.5, -0.5, Math.sin(a) * 0.5); n.push(0, -1, 0)
        idx.push(botC, vi, vi + 1)
    }
    return { positions: p, normals: n, indices: idx }
}

function makeCone(seg = 12): RawMesh {
    const p: number[] = [], n: number[] = [], idx: number[] = []
    const apex = 0; p.push(0, 0.5, 0); n.push(0, 1, 0)
    for (let i = 0; i <= seg; i++) {
        const a = (i / seg) * 2 * Math.PI
        const x = Math.cos(a) * 0.5, z = Math.sin(a) * 0.5
        p.push(x, -0.5, z)
        const len = Math.sqrt(x * x + 0.25 + z * z)
        n.push(x / len, 0.5 / len, z / len)
    }
    for (let i = 0; i < seg; i++) idx.push(apex, i + 1, i + 2)
    // Bottom cap
    const bc = p.length / 3; p.push(0, -0.5, 0); n.push(0, -1, 0)
    for (let i = 0; i < seg; i++) {
        const a = (i / seg) * 2 * Math.PI, a2 = ((i + 1) / seg) * 2 * Math.PI
        const vi = p.length / 3
        p.push(Math.cos(a2) * 0.5, -0.5, Math.sin(a2) * 0.5); n.push(0, -1, 0)
        p.push(Math.cos(a) * 0.5, -0.5, Math.sin(a) * 0.5); n.push(0, -1, 0)
        idx.push(bc, vi, vi + 1)
    }
    return { positions: p, normals: n, indices: idx }
}

function makeTorus(R = 0.4, r = 0.15, seg = 8, tubeSeg = 16): RawMesh {
    const p: number[] = [], n: number[] = [], idx: number[] = []
    for (let i = 0; i <= seg; i++) {
        const u = (i / seg) * 2 * Math.PI
        for (let j = 0; j <= tubeSeg; j++) {
            const v = (j / tubeSeg) * 2 * Math.PI
            const x = (R + r * Math.cos(v)) * Math.cos(u)
            const y = r * Math.sin(v)
            const z = (R + r * Math.cos(v)) * Math.sin(u)
            p.push(x, y, z)
            const cx = R * Math.cos(u), cz = R * Math.sin(u)
            const nx = x - cx, ny = y, nz = z - cz
            const len = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1
            n.push(nx / len, ny / len, nz / len)
        }
    }
    for (let i = 0; i < seg; i++) {
        for (let j = 0; j < tubeSeg; j++) {
            const a = i * (tubeSeg + 1) + j, b = a + tubeSeg + 1
            idx.push(a, b, a + 1, b, b + 1, a + 1)
        }
    }
    return { positions: p, normals: n, indices: idx }
}

function makeDodecahedron(): RawMesh {
    // Simplified: use icosahedron approximation
    return makeSphere(6)
}

function getGeometry(kind: string): RawMesh {
    switch (kind) {
        case 'box': return makeBox()
        case 'sphere': return makeSphere()
        case 'cylinder': return makeCylinder()
        case 'cone': return makeCone()
        case 'torus': return makeTorus()
        case 'dodecahedron': return makeDodecahedron()
        case 'plane': return makeBox() // flat box
        case 'ring': return makeTorus(0.4, 0.1, 6, 12)
        default: return makeBox()
    }
}

// ── Transform positions ──
function transformPositions(geo: RawMesh, pos: [number, number, number], scale: [number, number, number], rot?: [number, number, number]): Float32Array {
    const out = new Float32Array(geo.positions.length)
    const [sx, sy, sz] = scale
    const [px, py, pz] = pos
    // Simple rotation in degrees (Y-axis only for simplicity in batch gen)
    const ry = rot ? (rot[1] * Math.PI / 180) : 0
    const rx = rot ? (rot[0] * Math.PI / 180) : 0
    const rz = rot ? (rot[2] * Math.PI / 180) : 0
    const cy = Math.cos(ry), sy2 = Math.sin(ry)
    const cx = Math.cos(rx), sx2 = Math.sin(rx)
    const cz = Math.cos(rz), sz2 = Math.sin(rz)

    for (let i = 0; i < geo.positions.length; i += 3) {
        let x = geo.positions[i] * sx, y = geo.positions[i + 1] * sy, z = geo.positions[i + 2] * sz
        // Rotate Y
        const x1 = x * cy + z * sy2, z1 = -x * sy2 + z * cy
        x = x1; z = z1
        // Rotate X
        const y1 = y * cx - z * sx2, z2 = y * sx2 + z * cx
        y = y1; z = z2
        // Rotate Z
        const x2 = x * cz - y * sz2, y2 = x * sz2 + y * cz
        x = x2; y = y2

        out[i] = x + px; out[i + 1] = y + py; out[i + 2] = z + pz
    }
    return out
}

// ── GLB binary writer ──
function writeGLB(meshes: { positions: Float32Array; normals: Float32Array; indices: Uint16Array; color: [number, number, number]; metalness: number; roughness: number }[]): Buffer {
    // Build glTF JSON
    const bufferViews: any[] = []
    const accessors: any[] = []
    const meshDefs: any[] = []
    const nodeDefs: any[] = []
    const materialDefs: any[] = []
    const bufferData: Buffer[] = []
    let byteOffset = 0

    for (let mi = 0; mi < meshes.length; mi++) {
        const m = meshes[mi]
        // Material
        materialDefs.push({
            pbrMetallicRoughness: {
                baseColorFactor: [...m.color, 1],
                metallicFactor: m.metalness,
                roughnessFactor: m.roughness,
            },
            doubleSided: true,
        })

        // Positions buffer view
        const posBuf = Buffer.from(m.positions.buffer)
        const posViewIdx = bufferViews.length
        bufferViews.push({ buffer: 0, byteOffset, byteLength: posBuf.length, target: 34962 })
        bufferData.push(posBuf)
        let pMin = [Infinity, Infinity, Infinity], pMax = [-Infinity, -Infinity, -Infinity]
        for (let i = 0; i < m.positions.length; i += 3) {
            pMin[0] = Math.min(pMin[0], m.positions[i])
            pMin[1] = Math.min(pMin[1], m.positions[i + 1])
            pMin[2] = Math.min(pMin[2], m.positions[i + 2])
            pMax[0] = Math.max(pMax[0], m.positions[i])
            pMax[1] = Math.max(pMax[1], m.positions[i + 1])
            pMax[2] = Math.max(pMax[2], m.positions[i + 2])
        }
        const posAccIdx = accessors.length
        accessors.push({ bufferView: posViewIdx, componentType: 5126, count: m.positions.length / 3, type: 'VEC3', min: pMin, max: pMax })
        byteOffset += posBuf.length

        // Normals buffer view
        const normBuf = Buffer.from(m.normals.buffer)
        const normViewIdx = bufferViews.length
        bufferViews.push({ buffer: 0, byteOffset, byteLength: normBuf.length, target: 34962 })
        bufferData.push(normBuf)
        const normAccIdx = accessors.length
        accessors.push({ bufferView: normViewIdx, componentType: 5126, count: m.normals.length / 3, type: 'VEC3' })
        byteOffset += normBuf.length

        // Indices buffer view
        const idxBuf = Buffer.from(m.indices.buffer)
        const idxViewIdx = bufferViews.length
        bufferViews.push({ buffer: 0, byteOffset, byteLength: idxBuf.length, target: 34963 })
        bufferData.push(idxBuf)
        const idxAccIdx = accessors.length
        accessors.push({ bufferView: idxViewIdx, componentType: 5123, count: m.indices.length, type: 'SCALAR' })
        byteOffset += idxBuf.length
        // Pad to 4 bytes
        const pad = (4 - (byteOffset % 4)) % 4
        if (pad > 0) { bufferData.push(Buffer.alloc(pad)); byteOffset += pad }

        meshDefs.push({ primitives: [{ attributes: { POSITION: posAccIdx, NORMAL: normAccIdx }, indices: idxAccIdx, material: mi }] })
        nodeDefs.push({ mesh: mi })
    }

    const sceneNodes = nodeDefs.map((_, i) => i)
    const gltf = {
        asset: { version: '2.0', generator: 'Chronicles-GLBGen' },
        scene: 0,
        scenes: [{ nodes: sceneNodes }],
        nodes: nodeDefs,
        meshes: meshDefs,
        materials: materialDefs,
        accessors,
        bufferViews,
        buffers: [{ byteLength: byteOffset }],
    }

    const jsonStr = JSON.stringify(gltf)
    const jsonBuf = Buffer.from(jsonStr)
    const jsonPad = (4 - (jsonBuf.length % 4)) % 4
    const jsonChunk = Buffer.concat([jsonBuf, Buffer.alloc(jsonPad, 0x20)])

    const binBuf = Buffer.concat(bufferData)

    // GLB header: magic(4) + version(4) + length(4) = 12
    // JSON chunk: chunkLength(4) + chunkType(4) + data
    // BIN chunk: chunkLength(4) + chunkType(4) + data
    const totalLen = 12 + 8 + jsonChunk.length + 8 + binBuf.length
    const out = Buffer.alloc(totalLen)
    let off = 0

    // Header
    out.writeUInt32LE(0x46546C67, off); off += 4  // glTF magic
    out.writeUInt32LE(2, off); off += 4            // version
    out.writeUInt32LE(totalLen, off); off += 4     // total length

    // JSON chunk
    out.writeUInt32LE(jsonChunk.length, off); off += 4
    out.writeUInt32LE(0x4E4F534A, off); off += 4   // JSON
    jsonChunk.copy(out, off); off += jsonChunk.length

    // BIN chunk
    out.writeUInt32LE(binBuf.length, off); off += 4
    out.writeUInt32LE(0x004E4942, off); off += 4    // BIN
    binBuf.copy(out, off)

    return out
}

// ── Process one PropNode into meshes ──
function collectMeshes(node: PropNode, parentPos: [number, number, number] = [0, 0, 0]): { positions: Float32Array; normals: Float32Array; indices: Uint16Array; color: [number, number, number]; metalness: number; roughness: number }[] {
    const result: ReturnType<typeof collectMeshes> = []
    const preset = PRESETS[node.material] ?? PRESETS.default
    const color: [number, number, number] = node.color ? hexToRgb(node.color) : preset.color
    const geo = getGeometry(node.primitive)

    const worldPos: [number, number, number] = [
        node.position[0] + parentPos[0],
        node.position[1] + parentPos[1],
        node.position[2] + parentPos[2],
    ]

    const positions = transformPositions(geo, worldPos, node.scale, node.rotation)
    const normals = new Float32Array(geo.normals)
    const indices = new Uint16Array(geo.indices)

    result.push({ positions, normals, indices, color, metalness: preset.metalness, roughness: preset.roughness })

    if (node.children) {
        for (const child of node.children) {
            result.push(...collectMeshes(child, worldPos))
        }
    }
    return result
}

// ── Main ──
async function main() {
    const modelsDir = path.resolve(__dirname, '../public/models')
    for (const era of ['medieval', 'modern', 'wild-west']) {
        fs.mkdirSync(path.join(modelsDir, era), { recursive: true })
    }

    const base = 'd:/trustgen-3d/src/engine/recipes'
    let allRecipes: PropRecipe[] = []
    try {
        const { MEDIEVAL_ENV_RECIPES } = await import(`file:///${base}/medievalEnvRecipes.ts`)
        const { MODERN_ENV_RECIPES } = await import(`file:///${base}/modernEnvRecipes.ts`)
        const { WILDWEST_ENV_RECIPES } = await import(`file:///${base}/wildwestEnvRecipes.ts`)
        allRecipes = [...MODERN_ENV_RECIPES, ...MEDIEVAL_ENV_RECIPES, ...WILDWEST_ENV_RECIPES]
    } catch (err) {
        console.error('Import failed:', err)
        process.exit(1)
    }

    console.log(`\n⚡ GLB Generator — ${allRecipes.length} recipes\n`)

    let ok = 0, fail = 0
    for (const recipe of allRecipes) {
        try {
            const meshes = recipe.nodes.flatMap(n => collectMeshes(n))
            const glb = writeGLB(meshes)
            const outPath = path.join(modelsDir, recipe.era, `${recipe.id}.glb`)
            fs.writeFileSync(outPath, glb)
            ok++
            console.log(`  ✓ ${recipe.era}/${recipe.id}.glb  (${(glb.length / 1024).toFixed(1)} KB)`)
        } catch (err) {
            fail++
            console.error(`  ✗ ${recipe.id}: ${err}`)
        }
    }

    console.log(`\n  Done: ${ok} exported, ${fail} failed\n`)
}

main().catch(console.error)
