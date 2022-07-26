#!/bin/bash

target_name="IFTTT"
source_folder=$(pwd)/../Source/com.avermedia.ifttt
output_folder=$(pwd)

#version=`cat app/build.gradle.kts |grep versionName |cut -d"\"" -f 2 |head -1`
version=`cat "${source_folder}/PackageConfig.json" |grep Version |cut -d"\"" -f 4 |head -1`
if [ ! -z $1 ] && [ "${1:1}" != "$version" ]; then
    echo "${1:1} and $version are not matched!"
    version=${1:1}
    #exit 1
fi
if [[ "$version" != "v"* ]]; then
    version=v$version
fi

file_name_github=${target_name}.creatorCentral

TEMP_FOLDER=/tmp
# copy the source folder to make release app
rm -rf ${TEMP_FOLDER}/creatorCentral
mkdir ${TEMP_FOLDER}/creatorCentral
cp -a "${source_folder}" ${TEMP_FOLDER}/creatorCentral/
pushd ${TEMP_FOLDER}/creatorCentral/ || exit 1
zip -q -r ${TEMP_FOLDER}/creatorCentral/release.zip .
popd || exit 1

mv ${TEMP_FOLDER}/creatorCentral/release.zip "${output_folder}/${file_name_github}"

echo
ls -l "${output_folder}"
