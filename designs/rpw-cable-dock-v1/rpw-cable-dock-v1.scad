/*
  Robinson PrintWorks Cable Dock V1
  A no-support desktop dock for three charging/data cables.

  Print the base in Deep Royal Blue and the clips/inlay in Bright Cyan.
  Select the part to export by changing `part` below.
*/

$fn = 48;

part = "assembly"; // "base", "clip", "inlay", or "assembly"

// Shared product-family dimensions (millimeters)
base_width = 126;
base_depth = 70;
base_height = 16;
base_radius = 8;

clip_width = 18;
clip_depth = 12;
clip_height = 30;
clip_peg_width = 11.6;
clip_peg_depth = 7.6;
clip_peg_height = 5.2;
cable_slot_width = 8;

inlay_width = 96;
inlay_height = 7;
inlay_thickness = 0.8;

clip_positions = [28, 63, 98];

module rounded_box(width, depth, height, radius) {
  hull() {
    for (x = [radius, width - radius]) {
      for (y = [radius, depth - radius]) {
        translate([x, y, 0]) cylinder(h = height, r = radius);
      }
    }
  }
}

module base() {
  difference() {
    rounded_box(base_width, base_depth, base_height, base_radius);

    // Shallow top tray: catches loose ends and gives the piece a lighter profile.
    translate([12, 10, 12])
      rounded_box(base_width - 24, base_depth - 30, 4.1, 5);

    // Front recess for the separate cyan inlay.
    translate([(base_width - inlay_width) / 2, -0.01, 4.5])
      cube([inlay_width, inlay_thickness + 0.02, inlay_height]);

    // Peg slots for the three removable cable clips.
    for (x = clip_positions) {
      translate([x - (clip_peg_width + 0.4) / 2, 50 - (clip_peg_depth + 0.4) / 2, base_height - 5.1])
        cube([clip_peg_width + 0.4, clip_peg_depth + 0.4, 5.2]);
    }
  }
}

module clip() {
  difference() {
    union() {
      // A stable, slightly rounded upright cable guide.
      translate([0, 0, clip_peg_height])
        rounded_box(clip_width, clip_depth, clip_height - clip_peg_height, 2);

      // Peg is intentionally 0.2 mm undersized per side for a press fit.
      translate([(clip_width - clip_peg_width) / 2, (clip_depth - clip_peg_depth) / 2, 0])
        cube([clip_peg_width, clip_peg_depth, clip_peg_height + 0.2]);
    }

    // Top-open U channel: supports cables about 5–7 mm in diameter.
    translate([(clip_width - cable_slot_width) / 2, -0.1, 19])
      cube([cable_slot_width, clip_depth + 0.2, clip_height]);
  }
}

module inlay() {
  // Plain insert: add an embossed RPW mark later after testing the fit.
  cube([inlay_width - 0.3, inlay_thickness, inlay_height - 0.3]);
}

module assembly() {
  color("#073B78") base();

  for (x = clip_positions) {
    color("#22D3EE")
      translate([x - clip_width / 2, 50 - clip_depth / 2, base_height - clip_peg_height])
        clip();
  }

  color("#22D3EE")
    translate([(base_width - inlay_width) / 2 + 0.15, 0, 4.65])
      inlay();
}

if (part == "base") {
  base();
} else if (part == "clip") {
  clip();
} else if (part == "inlay") {
  inlay();
} else {
  assembly();
}
