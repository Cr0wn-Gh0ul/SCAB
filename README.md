# SCAB
####  The Ethereum (S)mart (C)ontract (A)pp (B)uilder
>This tool allows you to build an electron application that runs a local Ethereum blockchain emulator (Ganache) with a deployed contract. The built application includes user interface to call & send transactions to the contract, view the logs, and switch accounts. *NOTE: This is a Proof-Of-Concept and as such is expected to break.

![Screenshot](https://github.com/Cr0wn-Gh0ul/SCAB/blob/master/scab-screenshot.png?raw=true)
##### Requirements
- Bash 4.5+
- Node.js 12+
- NPM 6+

##

### Setup

1. Clone this repo.
2. `npm run setup`
3. Edit `contractInfo.json`
	- Contract Name
	- Byte code
	- ABI
	- Constructor Arguments

##
### Build App

Linux: `npm run build-linux`  
Windows: `npm run build-windows`  
Mac: `npm run build-mac` !(Not tested)  
All: `npm run build-all`

> Built files will be in the /dist directory

##

### Dev Mode
> This allows you to run the application stack without building the app.

1. `npm run dev`
2. Wait for React to start...
3. In the app "View > Reload"
