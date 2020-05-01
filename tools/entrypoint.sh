#!/bin/sh
set -e

toolsDir=$(dirname $0)
mapsDir=$1
outDir=$2

tmpDir="/tmp/build-shit"
mehUtils=$toolsDir/meh-utils

# create tmp dir
mkdir -p $tmpDir
rm -rf $tmpDir/*

# create out dir
mkdir -p $outDir
rm -rf $outDir/*

ARROW="\342\217\251"

for mapPath in $mapsDir/*/ ; do
    worldName=$(basename $mapPath)
    mapOutDir=$outDir/$worldName

    echo "--------------------------------------------------"
    echo "\360\237\227\272\357\270\217  $worldName"
    echo "--------------------------------------------------"

    echo "$ARROW Creating output directory ($worldName)\n"
    mkdir -p $mapOutDir

    echo "$ARROW Copying meta.json and preview.png ($worldName)\n"
    cp $mapPath/meta.json $mapOutDir/meta.json
    cp $mapPath/preview.png $mapOutDir/preview.png

    echo "$ARROW Building satellite tiles ($worldName)\n"
    mkdir -p $mapOutDir/sat
    $mehUtils sat -in $mapPath -out $mapOutDir/sat
    echo ""

    echo "▶️ Building mapbox vector tiles ($worldName)\n"
    mkdir -p $mapOutDir/mvt
    $mehUtils mvt -in $mapPath -out $mapOutDir/mvt -layer_settings $toolsDir/layer_settings.json
    echo ""
done

