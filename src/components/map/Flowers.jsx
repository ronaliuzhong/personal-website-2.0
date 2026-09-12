// Small translucent flower clusters, scattered across the map as
// ambient background decoration — same spirit as Trees.jsx's scattered
// leaf-dots, just flower-shaped instead. Each flower is just 4 small
// petal circles around a tiny center circle, matching the site's
// established "simple SVG primitives, not intricate paths" style.

function Flower({ cx, cy, color, scale = 1 }) {
  const r = 3 * scale
  const offset = 4.5 * scale
  return (
    <g opacity="0.35">
      <circle cx={cx} cy={cy - offset} r={r} fill={color} />
      <circle cx={cx + offset} cy={cy} r={r} fill={color} />
      <circle cx={cx} cy={cy + offset} r={r} fill={color} />
      <circle cx={cx - offset} cy={cy} r={r} fill={color} />
      <circle cx={cx} cy={cy} r={r * 0.6} fill={color} opacity="0.6" />
    </g>
  )
}

function Flowers() {
  return (
    <g id="flowers">
      <Flower cx={150} cy={140} color="#ED93B1" />
      <Flower cx={480} cy={200} color="#FAC775" scale={0.85} />
      <Flower cx={80} cy={340} color="#B5D4F4" />
      <Flower cx={410} cy={420} color="#ED93B1" scale={0.9} />
      <Flower cx={280} cy={80} color="#FAC775" scale={0.8} />
      <Flower cx={600} cy={300} color="#ED93B1" scale={0.85} />
      <Flower cx={200} cy={480} color="#B5D4F4" scale={0.9} />
      <Flower cx={520} cy={520} color="#FAC775" />
      <Flower cx={50} cy={220} color="#ED93B1" scale={0.75} />
      <Flower cx={380} cy={320} color="#B5D4F4" scale={0.8} />

      {/* Simple single-dot "tiny flowers" — same color palette, no
          petal arrangement, just a plain small colored circle. Reads
          as smaller/more distant flowers next to the detailed
          clusters, giving the scatter some real depth/variety rather
          than every flower being the same size and prominence. */}
      <circle cx={230} cy={160} r="2.5" fill="#ED93B1" opacity="0.4" />
      <circle cx={330} cy={250} r="2" fill="#FAC775" opacity="0.4" />
      <circle cx={130} cy={420} r="2.5" fill="#B5D4F4" opacity="0.35" />
      <circle cx={450} cy={340} r="2" fill="#ED93B1" opacity="0.4" />
      <circle cx={560} cy={150} r="2.5" fill="#FAC775" opacity="0.35" />
      <circle cx={30} cy={480} r="2" fill="#B5D4F4" opacity="0.4" />
      <circle cx={620} cy={440} r="2.5" fill="#ED93B1" opacity="0.35" />
      <circle cx={350} cy={480} r="2" fill="#FAC775" opacity="0.4" />
      <circle cx={100} cy={80} r="2.5" fill="#B5D4F4" opacity="0.35" />
      <circle cx={470} cy={90} r="2" fill="#ED93B1" opacity="0.4" />
      <circle cx={250} cy={380} r="2.5" fill="#FAC775" opacity="0.35" />
      <circle cx={560} cy={480} r="2" fill="#B5D4F4" opacity="0.4" />
    </g>
  )
}

export default Flowers