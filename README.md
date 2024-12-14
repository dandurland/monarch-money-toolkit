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

- [Intro](#intro)
- [Current Features](#current-features)
- [Feature Roadmap](#feature-roadmap)
- [Installing on Chrome](#installing-on-chrome)
- [Installing on Firefox](#installing-on-firefox)

 ## Intro

Monarch Money Toolkit extends the web version of [Monarch Money](https://monarchmoney.com) with features, styles and tweeks not found in the current offering.
With inspiration stemming from the [You Need A Budget Toolkit](https://www.toolkitforynab.com/) and scaffolding based on the [Chrome Extension Boilerplate](https://github.com/Jonghakseo/chrome-extension-boilerplate-react-vite?tab=readme-ov-file).

> [!WARNING]
> This is an <b>ALPHA</b> release. This version contains no features that alter your Monarch Money data but, like any 3rd party extension, it could cause Monarch Money UI issues. If you encounter any issues please open a [ticket](https://github.com/dandurland/monarch-money-toolkit/issues) with the details.
> I plan to relase this to the [Chrome Store](https://chromewebstore.google.com/category/extensions) and [Mozilla Add-On Store](https://addons.mozilla.org/en-US/firefox) once it has been in the wild for a bit and other features have been aded.
>
> 
> Please submit any feature requests or issues [here](https://github.com/dandurland/monarch-money-toolkit/issues)

## Current Features
- Support for latest Monarch Money Light and Dark themes
- Dashboard integration for widgets and features
    - Over budget category badge and count added to the left side Budget navigation
    - Over budget category widget that displays the over budget categories on the dashboard
  ![dashboard_dark](https://github.com/user-attachments/assets/ab5fc690-9492-48f4-a377-9050852c47da)
  ![dashboard](https://github.com/user-attachments/assets/34583531-352c-43e9-a41c-c4a931af0576)

- Customizable transaction row height
    - Compact
    - ![transactions-compact](https://github.com/user-attachments/assets/43fd0c19-4059-4a57-8cbb-7a899427dd56)
    - Large
    - ![transactions-large](https://github.com/user-attachments/assets/c4772bf0-1c4e-443e-b043-96639f181ac4)

## Feature Roadmap
- Effective balance displaying your credit usage verses your depository accounts. Both credit and deository accounts are configurable.
- Monthly rollup of budgeted but unspent dollars into target category(s)
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
> Firefox does not persist temporary extensions between instances. Unfortunatly you will have to load the extension each time you launch Firefox until it is release to the Add-On Store.
