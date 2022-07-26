@echo off

set target_name=IFTTT
set source_folder=%cd%\..\Source\com.avermedia.ifttt
set output_folder=%cd%

REM Make sure you have 7-Zip installed here
set UPZIP="C:\\Program Files\\7-Zip\\7z.exe"

REM Make a loop list to delete data
set TRASH_LAST_INDEX=-1
setlocal enabledelayedexpansion
set TRASH_LIST[0]=*.bat
set TRASH_LIST[1]=*.sh
set TRASH_LIST[2]=*.tmp

REM Make a loop list to add data
set GOLD_LAST_INDEX=-1
setlocal enabledelayedexpansion
set GOLD_LIST[0]=%cd%\..\README.md

REM dir %source_folder%
REM dir %output_folder%

REM type "%source_folder%\PackageConfig.json" | find "Version"

for /f "tokens=2 delims= " %%a in ('type "%source_folder%\PackageConfig.json" ^| find "Version"') do (
	set tempvar=%%a
	goto print
)

:print
set tempvar=%tempvar:~0,-2%
set tempvar=%tempvar:~1%
echo version = %tempvar%

set file_name_pv=%target_name%.v%tempvar%.creatorCentral
echo file name = %file_name_pv%
echo %TEMP%

rmdir /s /q %TEMP%\creatorCentral
mkdir %TEMP%\creatorCentral
mkdir %TEMP%\creatorCentral\%target_name%
xcopy /s /q /y %source_folder% %TEMP%\creatorCentral\%target_name%\

if not %TRASH_LAST_INDEX% == -1 (
	pushd %TEMP%\creatorCentral\%target_name%

	for /l %%a in (0,1,%TRASH_LAST_INDEX%) do (
		echo ... removing !TRASH_LIST[%%a]!
		del /f /q !TRASH_LIST[%%a]!
		rmdir /s /q !TRASH_LIST[%%a]!
	)

	popd
)

if not %GOLD_LAST_INDEX% == -1 (
	pushd %TEMP%\creatorCentral\%target_name%
	
	for /l %%a in (0,1,%GOLD_LAST_INDEX%) do (
		echo ... adding !GOLD_LIST[%%a]!
		copy !GOLD_LIST[%%a]! .
	)
	
	popd
)

%UPZIP% a %TEMP%\creatorCentral\release.zip %TEMP%\creatorCentral\%target_name% -y > nul
rename %TEMP%\creatorCentral\release.zip %file_name_pv%
move %TEMP%\creatorCentral\%file_name_pv% %output_folder%\%file_name_pv%
