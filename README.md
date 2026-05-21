BATU-HA
=======================

[Cloud-Native Hypsometric Analysis: A Web-Based Interactive Tool Using Google Earth Engine for Global DEM Comparison and Accessible Geomorphometry]

[BATU LFP + Tc Calculator Application](https://ee-mynet34.projects.earthengine.app/view/batu-ha)

For contributions and comments: mehmet.arslanoglu@batman.edu.tr, mynet34@gmail.com

-   [Earth Engine Homepage](https://earthengine.google.com/)
-   [Web Code Editor](https://code.earthengine.google.com/)

## INTRODUCTION:

To inspect and test the application's code, paste the BATU-HA-GEE-Code.js code into the Google Earth Engine Code Editor window and run it by pressing the Run button.

Important Note: Access to Google Earth Engine is currently only available to registered users.

License: This work is licensed under CC BY-NC-SA 4.0. To view a copy of this license, visit https://creativecommons.org/licenses/by-nc-sa/4.0/

BATU-HA GEE  Interactive Hypsometric Analysis Tool Application User Manual
=======================

This guide provides step-by-step instructions for using the Interactive Hypsometric Analysis Tool in Google Earth Engine (GEE). This tool extracts hypsometric curves, calculates Hypsometric Integrals (HI) using dual methods, and computes Harlin (1978) statistical moments across multiple Digital Elevation Models (DEMs).

---

1. Interface Overview

The interface is divided into three main sections:
- Left Panel (Control Panel): Used for selecting DEM sources, loading test cases, picking watershed datasets, and initiating calculations.
- Center Panel (Map View): Displays the selected region, watershed boundaries, dynamically generated elevation contours, and hypsometric tinting.
- Right Panel (Results Panel): Appears after an analysis is complete. It displays interactive charts, calculated HI values, validation comparisons, statistical moments, and area-elevation tables.

---

2. Choosing an Analysis Region

When the application is first opened, it focuses on the Bolu basin in the NAZF region of Turkey and conducts its hypsometric analyses.

You can select a region for analysis using one of three methods:

Method A: Pre-loaded Test Cases (Fastest)
The tool includes 53 validated and theoretical basins (e.g., NAFZ, India, Spain, USA) to test accuracy against published literature.
1. Go to the "Quick Test Cases" dropdown in the Control Panel.
2. Select a basin.
3. The tool will automatically zoom to the region, load the boundary, and auto-run the analysis.

Method B: Click-to-Analyze Watersheds
You can interactively click on global or US-based watershed boundaries to analyze them.
1. Under "Click-to-Analyze Watershed", use the first dropdown (Select Dataset Type) to choose between HUC (USA) or HYDROSHEDS (Global).
2. Use the second dropdown (Select Level / Scale) to choose the watershed size (e.g., HUC 8, HydroSHEDS Level 6).
3. The watershed boundaries will appear as blue outlines on the map.
4. Click inside any watershed boundary on the map. The tool will automatically extract the geometry and auto-run the analysis.

Method C: Custom Drawn Regions
1. Use the drawing tools (Rectangle or Polygon) located in the top-left corner of the map.
2. Draw your desired region of interest.
3. Click the "Calculate Hypsometric Curves" button in the Control Panel to start the analysis.

---

3. Configuring DEM Sources

Before running an analysis (especially for custom regions), ensure your desired DEMs are selected in the Control Panel under "Select DEMs":
- SRTM GL1 (30m): Global (60 N to 56 S)
- Copernicus DEM (30m): Global (Full coverage)
- ALOS World 3D (30m): Global
- NASADEM (30m): Global (60 N to 56 S)
- ASTER GDEM v3 (30m): Global (60 N to 56 S)
- USGS NED (10m): USA Only

Note: If a selected DEM does not cover your chosen region, the tool will automatically skip it and notify you in the Results Panel.

---

4. Understanding the Results

Once the calculation is complete, the Results Panel on the right will display the following data:

Interactive Hypsometric Charts
- Absolute Curve: Displays altitude (m) on the Y-axis against cumulative area (%) on the X-axis.
- Normalized Curve: Check the box labeled "Show Normalized Curve" to view the dimensionless chart (Relative Elevation h/H vs. Relative Area a/A).
Tip: You can hover over the chart lines to see the exact values for each DEM.

Hypsometric Integral (HI) Values
The tool calculates HI using two distinct methods simultaneously:
- M1 (E-R Ratio): Calculated using the Elevation-Relief Ratio method (Pike & Wilson, 1971).
- M2 (Integral): Calculated using the trapezoidal curve integral method (Strahler, 1952).

The tool also automatically categorizes the basin's geomorphic stage based on the HI value:
- Young (Steep): HI > 0.60
- Mature (Balanced): HI 0.35 to 0.60
- Old (Eroded): HI < 0.35
(If using a Pre-loaded Test Case, the panel will also display the absolute difference between the GEE-calculated HI and the published literature value).

Elevation Statistics & Harlin (1978) Moments
- Basic Stats: Minimum, Maximum, and Mean elevations for the basin.
- Polynomial Fit: The equation of the 3rd-order polynomial fit used for moment extraction.
- Statistical Moments: Skewness, Kurtosis, Density Skew, and Density Kurtosis. 
Interpretation: Positive skewness indicates dominant headward erosion, while high kurtosis (>3) indicates a sharp mid-basin peak.

Area by Elevation Band
At the bottom of the panel, the tool generates a breakdown of the basin area (in square kilometers and %) distributed across specific elevation intervals (e.g., every 50m, 100m, or 250m, dynamically scaled based on total relief).

---

5. Map Visualizations & Data Export

- Map Layers: Upon completion, the map updates with a color-coded hypsometric tint (from deep blue/green lowlands to white peaks) and dynamically generated elevation contours. You can toggle these in the map's Layers menu.
- Clearing Data: To start over or clear the map, click the "Clear Results" button in the Control Panel.
- Batch Export: If you check the GEE Console tab, the tool automatically prints summary tables for all 53 test cases (Published HI vs. Calculated HI), which can be explored or exported for external use.
