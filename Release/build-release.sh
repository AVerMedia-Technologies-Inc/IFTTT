#!/bin/bash
# To build for production release
# $ ./build-release.sh
# To build for legacy production release
# $ ./build-release legacy

target_name="com.avermedia.ifttt"
source_folder="../Source"
output_folder="./"

#version=`cat app/build.gradle.kts |grep versionName |cut -d"\"" -f 2 |head -1`
version=`cat ${source_folder}/${target_name}/PackageConfig.json |grep Version |cut -d"\"" -f 4 |head -1`
if [ ! -z $1 ] && [ "${1:1}" != "$version" ]; then
    echo "${1:1} and $version are not matched!"
    version=${1:1}
    #exit 1
fi
if [[ "$version" != "v"* ]]; then
    version=v$version
fi

# com.avermedia.ifttt.creatorCentral
file_name_github=${target_name}.creatorCentral

pushd ${source_folder}
zip -q -r /tmp/release.zip ${target_name}
popd

mv /tmp/release.zip ${output_folder}/${file_name_github}

echo
ls -l ${output_folder}
