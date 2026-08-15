# RPW Cable Dock V1

An original, no-support desktop dock for three charging or data cables. It is
the first functional product in the Robinson PrintWorks royal-blue/bright-cyan
family.

## Parts

| Part | Quantity | Filament | Purpose |
| --- | ---: | --- | --- |
| Base | 1 | Deep Royal Blue | Weighted desktop tray and clip receiver |
| Clip | 3 | Bright Cyan | Removable cable guides |
| Inlay | 1 | Bright Cyan | Front precision-detail insert |

The OpenSCAD source uses the following export choices:

- `part = "base"`
- `part = "clip"`
- `part = "inlay"`
- `part = "assembly"` for a color preview only

Export each printable part as its own STL. The clips are identical, so export
one clip STL and print three copies.

## First prototype: P1S

Print the base and one clip in ordinary PLA before committing to the final
two-color run.

- 0.4 mm nozzle; 0.20 mm layer height
- 3 walls; 4 top and bottom layers
- 15% gyroid infill for the base; 25% for clips
- No supports
- Print the base flat on its bottom; print clips upright on their pegs

Test the clip with the largest everyday cable you expect to support. If it is
too tight, change `cable_slot_width` from `8` to `8.4`. If the clip is too loose
in the base, change the `+ 0.4` slot allowance in `base()` to `+ 0.25`.

## Final run: Snapmaker U1

Use the same 0.4 mm nozzle and 0.20 mm layers. Print the royal-blue base,
three bright-cyan clips, and cyan inlay as separate parts. This is more robust
than relying on a color change inside a functional press-fit.

For an indoor desk product, use PLA. Use PETG for the clips if they need more
flex, but keep the base and clips the same material when you want the press-fit
to be predictable.

## Assembly

1. Press the three cyan clips into the rear slots.
2. Press the cyan inlay into the front recess; it should stay in place without
   glue after the first fit test.
3. Route one cable through each top-open clip and coil extra cable in the tray.

## V2 opportunities

- Add an embossed RPW mark to the inlay after V1 fit testing.
- Offer 2-, 3-, and 5-clip widths.
- Add a removable magnetic weight pocket underneath.
- Create a matching phone-stand module using the same 3 mm radii and cyan
  inlay depth.
