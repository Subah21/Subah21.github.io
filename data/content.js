/* ==========================================================================
   EDIT THIS FILE to change what the site says. Nothing else needs touching
   to add a project, a photo, a video or a code file. See README.md.

   Fields left empty ("" or []) are simply hidden on the page.
   ========================================================================== */

window.SITE = {
  name: "Sabah Al-Haidari",
  headline: ["Sabah", "Al-Haidari"],          // the two lines of the big title
  intro:
    "I build radio systems from the RF front end to the processor that interprets them: software-defined radio, FPGA signal processing and edge AI.",

  school: {
    name: "Michigan State University",
    detail: "B.S. Electrical Engineering and Computer Engineering, expected December 2027",
  },

  links: {
    email: "sabah.alhaidari10@gmail.com",
    github: "https://github.com/Subah21",      // check this matches your username
    linkedin: "",                              // paste your full LinkedIn URL
    resume: "",                                // e.g. "assets/resume.pdf" after you upload it
  },

  skills: [
    { group: "Languages", items: "Python, C and C++, Verilog, SQL, MATLAB" },
    { group: "RF and SDR", items: "HackRF One, GNU Radio, 5G NR, LoRaWAN, spectrum analysis, Keysight ADS, Ansys HFSS" },
    { group: "FPGA and embedded", items: "Nexys A7 (Artix-7), Vivado, Raspberry Pi 5, Hailo accelerator, Pixhawk and ArduPilot, ESP32-S3, nRF, Arduino" },
    { group: "Design and tools", items: "Altium Designer, LTSpice, Git, Linux" },
  ],
};

/* --------------------------------------------------------------------------
   PROJECTS. Order here is the order of the tabs.

   Each project can have:
     id        short lowercase name, used in the URL (#drone)
     tab       name on the tab           tabNote   small line under it
     title     heading inside the page   status    e.g. "In progress" (optional)
     role, org, period                   shown in the left column
     summary   one or two sentences      note      small muted line (optional)
     built     list of things you built (one sentence each)
     stack     list of tools / parts
     parts     [{ qty: 3, name: "ESP32-S3" }]   a hardware list (optional)
     links     [{ label: "GitHub repository", href: "https://..." }]
     figure    a diagram: see the examples below, or { kind:"image", src, alt, caption }
     media     photos and videos: shows a Gallery tab when not empty
     code      code files: shows a Code tab when not empty

   media examples (put the files in media/<id>/ and list them here):
     { type: "image",   src: "media/drone/rig.jpg", alt: "The drone on the bench", caption: "Airframe with the Pi 5 and Hailo board" },
     { type: "video",   src: "media/drone/flight.mp4", poster: "media/drone/flight.jpg", caption: "First autonomous flight" },
     { type: "youtube", id: "dQw4w9WgXcQ", title: "Demo", caption: "Full walkthrough" },

   code examples (put the files in media/<id>/code/ or paste text directly):
     { file: "fir_bandpass.v", lang: "verilog", src: "media/drone/code/fir_bandpass.v",
       note: "FIR band-pass filter", href: "https://github.com/Subah21/repo/blob/main/fir_bandpass.v" },
     { file: "snippet.py", lang: "python", text: "print('hello')" },
   lang can be: verilog, python, c, cpp, js, matlab, bash, text
   -------------------------------------------------------------------------- */

window.PROJECTS = [
  {
    id: "drone",
    tab: "Signal Intelligence Drone",
    tabNote: "FPGA, SDR and edge AI",
    title: "Autonomous Signal Intelligence Drone",
    role: "Individual project",
    period: "May 2025 to Aug 2026",
    summary:
      "An autonomous drone that detects objects onboard and sends encrypted telemetry to a ground station, where an FPGA and a software-defined radio analyze the RF spectrum.",
    built: [
      "Object detection with YOLOv8 running onboard on a Hailo AI accelerator (26 TOPS) paired with a Raspberry Pi.",
      "Flight control on a Pixhawk running ArduPilot, commanded over MAVLink.",
      "An AES-256 encrypted LoRa link at 868 MHz carrying telemetry from the drone to the ground station.",
      "A ground-station FPGA pipeline in Verilog on a Nexys A7-100T (Artix-7): an FIR band-pass filter and a 256-point FFT for real-time RF spectrum analysis.",
      "A HackRF One with GNU Radio for signal capture, demodulation and live classification, alongside the FPGA pipeline.",
    ],
    stack: ["Python", "Verilog", "Vivado", "ArduPilot", "GNU Radio", "Raspberry Pi OS"],
    links: [],
    figure: {
      kind: "flow",
      caption: "System overview. The dashed line is the wireless link.",
      stages: [
        {
          label: "On the drone",
          lanes: [
            {
              items: [
                { t: "Pixhawk", s: "ArduPilot flight control" },
                { link: "MAVLink" },
                { t: "Raspberry Pi with Hailo", s: "YOLOv8 object detection" },
              ],
            },
          ],
        },
        { bridge: "LoRa, 868 MHz\nAES-256" },
        {
          label: "Ground station",
          lanes: [
            {
              title: "FPGA, Nexys A7-100T",
              items: [
                { t: "FIR band-pass filter", s: "Verilog" },
                { link: "" },
                { t: "256-point FFT", s: "Verilog" },
              ],
            },
            {
              title: "SDR, HackRF One",
              items: [
                { t: "Capture", s: "HackRF One" },
                { link: "" },
                { t: "Demodulation", s: "GNU Radio" },
                { link: "" },
                { t: "Classification", s: "live" },
              ],
            },
          ],
        },
      ],
    },
    media: [],
    code: [],
  },

  {
    id: "ofdm",
    tab: "Secure OFDM Research",
    tabNote: "5G NR and 6G physical layer",
    title: "Securely Precoded OFDM for 5G NR and 6G",
    role: "DoD-sponsored research internship",
    org: "Michigan State University, under Prof. Tongtong Li",
    period: "May 2026 to Dec 2026",
    summary:
      "Physical-layer research on secure waveforms for 5G NR and 6G, implemented and evaluated on software-defined radio hardware.",
    note: "More detail is available on request.",
    built: [
      "Implementing OFDM physical-layer waveforms for 5G NR and 6G on software-defined radios using securely precoded OFDM.",
      "Evaluating spectral efficiency against eavesdropping resistance.",
      "Characterizing channel estimation, pilot design and synchronization across simulated multipath environments.",
    ],
    stack: ["OFDM", "5G NR and 6G physical layer", "Software-defined radio"],
    links: [],
    figure: {
      kind: "ofdm",
      caption:
        "Background: OFDM subcarriers overlap in frequency yet stay orthogonal. At each subcarrier's center, every other subcarrier crosses zero.",
    },
    media: [],
    code: [],
  },

  {
    id: "solar",
    tab: "Solar Car Telemetry",
    tabNote: "Telemetry and RF hardware",
    title: "Solar Car Telemetry and RF",
    role: "Telemetry sub-lead, RF and BMS engineer",
    org: "MSU Solar Car Club",
    period: "Jan 2025 to present",
    summary:
      "Telemetry and radio systems for Michigan State's solar car: battery-management firmware, an onboard telemetry computer, a ground-station dashboard, and a transmitter and receiver being designed in-house.",
    built: [
      "Developed CEPS firmware in C++ for the battery management system's microcontrollers.",
      "Designed the telemetry system on a Raspberry Pi Zero 2W with a LilyGo T-Beam and a Waveshare SX1302 LoRaWAN HAT, interfaced with the vehicle control unit.",
      "Own the ground-station dashboard that displays the telemetry.",
      "Designing the team's own transmitter and receiver for its communications system in Altium Designer, Keysight ADS and Ansys HFSS.",
    ],
    stack: [
      "C++",
      "Raspberry Pi Zero 2W",
      "LilyGo T-Beam",
      "SX1302 LoRaWAN HAT",
      "Altium Designer",
      "Keysight ADS",
      "Ansys HFSS",
    ],
    links: [],
    figure: {
      kind: "flow",
      caption: "Simplified system overview. The dashed line is the wireless link.",
      stages: [
        {
          label: "On the car",
          lanes: [
            {
              title: "Telemetry",
              items: [
                { t: "Vehicle control unit", s: "VCU" },
                { link: "interface" },
                { t: "Raspberry Pi Zero 2W", s: "T-Beam, SX1302 LoRaWAN HAT" },
              ],
            },
            {
              title: "Battery management",
              items: [{ t: "BMS microcontrollers", s: "CEPS firmware, C++" }],
            },
          ],
        },
        { bridge: "Radio link" },
        {
          label: "Ground station",
          lanes: [{ items: [{ t: "Dashboard", s: "telemetry display" }] }],
        },
      ],
    },
    media: [],
    code: [],
  },

  {
    id: "mapping",
    tab: "Spatial Mapping",
    tabNote: "LiDAR and wireless nodes",
    title: "Distributed Spatial Mapping",
    role: "Individual project",
    status: "In progress",
    summary:
      "A spatial-mapping system built from a Raspberry Pi 5 with a D500 LiDAR, three ESP32-S3 boards, three nRF boards and an Arduino Uno Q.",
    note: "Work in progress. Photos, wiring and code are added here as each stage works.",
    built: [],
    stack: ["Raspberry Pi 5", "D500 LiDAR", "ESP32-S3", "nRF", "Arduino Uno Q"],
    parts: [
      { qty: 1, name: "Raspberry Pi 5" },
      { qty: 1, name: "D500 LiDAR" },
      { qty: 3, name: "ESP32-S3" },
      { qty: 3, name: "nRF boards" },          // put the exact part number here
      { qty: 1, name: "Arduino Uno Q" },
    ],
    links: [],
    media: [],
    code: [],
  },
];
