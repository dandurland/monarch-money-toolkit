<div align="center">

<picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://github.com/user-attachments/assets/48e2345c-ad35-45e1-9e53-4e72dc0fbea7" />
    <source media="(prefers-color-scheme: light)" srcset="https://github.com/user-attachments/assets/1f86e75a-84f6-478b-b292-44a263221e2c" />
    <img alt="Logo" src="https://github.com/user-attachments/assets/4128549d-9977-4ecf-8c8c-703b08debd4e" />
</picture>

![](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
![](https://img.shields.io/badge/Typescript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![](https://badges.aleen42.com/src/vitejs.svg)

![GitHub action badge](https://github.com/dandurland/monarch-money-toolkit/actions/workflows/build-zip.yml/badge.svg)
![GitHub action badge](https://github.com/dandurland/monarch-money-toolkit/actions/workflows/lint.yml/badge.svg)

<img src="https://hits.seeyoufarm.com/api/count/incr/badge.svg?url=https://github.com/dandurland/monarch-money-toolkitFactions&count_bg=%23#222222&title_bg=%23#454545&title=😀&edge_flat=true" alt="hits"/>

</div>

## Table of Contents

- [Table of Contents](#table-of-contents)
- [Intro](#intro)
- [Features](#features)
  - [Version 0.2.0](#version-020)
  - [Version 0.1.3](#version-013)
  - [Version 0.1.2](#version-012)
- [Feature Roadmap](#feature-roadmap)
- [Getting Started Chrome](#getting-started-chrome)
- [Installing on Chrome](#installing-on-chrome)
- [Installing on Firefox](#installing-on-firefox)

 ## Intro

Monarch Money Toolkit extends the web version of [Monarch Money](https://monarchmoney.com) with features, styles and tweeks not found in the current offering.
With inspiration stemming from the [You Need A Budget Toolkit](https://www.toolkitforynab.com/) and scaffolding based on the [Chrome Extension Boilerplate](https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite?tab=readme-ov-file).

> [!WARNING]
> This is an <b>BETA</b> release. This version contains no features that alter your Monarch Money data but, like any 3rd party extension, it could cause Monarch Money UI issues. If you encounter any issues please open a [ticket](https://github.com/dandurland/monarch-money-toolkit/issues) with the details.
> I plan to release this to the [Chrome Store](https://chromewebstore.google.com/category/extensions) and [Mozilla Add-On Store](https://addons.mozilla.org/en-US/firefox) once it has been in the wild for a bit and other features have been added.
>
> 
> Please submit any feature requests or issues [here](https://github.com/dandurland/monarch-money-toolkit/issues)

## Features

### Version 0.2.0
- Dashboard widgets can be dragged to change display order
- Dashboard widget host is now hidden when no widgets are enabled
- Effective Balance dashboard widget - Displays configured depository account balances in relation to credit account balances.

  <img src="https://github.com/user-attachments/assets/279a3add-82e2-4dea-82db-4753cfbfe61b" alt="Effective Balance Widget" width="400">
  <img src="https://github.com/user-attachments/assets/b9168702-1719-460d-8de4-dcad307c3c2a" alt="Effective Balance Widget Settings" height="317">

- Miscellaneous bug fixes
  
### Version 0.1.3
- Support for latest Monarch Money Light and Dark themes
- Customizable budget row height
  
### Version 0.1.2
- Dashboard integration for widgets and features
    - Over budget category badge and count added to the left side Budget navigation
  
  <img src="https://github.com/user-attachments/assets/ab5fc690-9492-48f4-a377-9050852c47da" alt="Over Budget Widget - Dark" width="400">
  
    - Over budget category widget that displays the over budget categories on the dashboard
  
  <img src="https://github.com/user-attachments/assets/34583531-352c-43e9-a41c-c4a931af0576" alt="Over Budget Widget - Light" height="270">

- Customizable transaction row height
    - Compact
  
      <img src="https://github.com/user-attachments/assets/43fd0c19-4059-4a57-8cbb-7a899427dd56" alt="Transaction Row Height - Compact" width="400">
      
    - Large
  
      <img src="https://github.com/user-attachments/assets/c4772bf0-1c4e-443e-b043-96639f181ac4" alt="Transaction Row Height - Large" width="400">

## Feature Roadmap
- Monthly rollup of unspent, budgeted dollars into target category(s)
- Release to Chrome and Mozilla stores
- Amazon order integration

## Getting Started Chrome

## Installing on Chrome

1. Download the latest release zip (`chrome-monarch-amazon-sync.zip`) from the [releases page](https://github.com/dandurland/monarch-money-toolkit/releases/latest)
2. Unzip the file
3. Open Chrome and type or paste `chrome://extensions` in the navigation bar
4. Enable developer mode by clicking the toggle switch next to <B>Developer mode</B>
5. Click "Load unpacked" and select the folder where you unzipped the extension

## Installing on Firefox

1. Download the latest release zip (`firefox-monarch-amazon-sync.zip`) from the [releases page](https://github.com/dandurland/monarch-money-toolkit/releases/latest)
2. Unzip the file
3. Open Firefox and type or paste `about:debugging#/runtime/this-firefox` in the navigation bar
4. Click "Load Temporary Add-on..." and select the manifest.json file in the unzipped folder
> [!NOTE]
> Firefox does not persist temporary extensions between instances. Unfortunately you will have to load the extension each time you launch Firefox until it is release to the Add-On Store.