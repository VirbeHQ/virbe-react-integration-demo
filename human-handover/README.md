# Virbe React Integration Sample for multiple screens

This sample demonstrates how to integrate Virbe with a React application that has multiple screens eg. separate Display and Control screens.
You can switch between Display, Control and Admin screen - for best experience, use 3 separate browser widows. This sample uses LocalStorage to synchronize state between browser windows.

## Getting started
1. Install dependencies
```bash
npm install
```
1. Create and configure Web Widget Profile in Virbe Dashboard eg. https://dashboard-virbe.virbe.app (<your-dashboard-url>)
![Web Widget Profile Deployment](./docs/dashboard.png)
1. Create `.env` file eg. copy .env.sample and fill in ProfileId, ProfileSecret and Dashboard URL (from step 1)
1. Start the application
```bash
npm run dev
```
1. Open 3 browser windows:
   - Touch Control: http://localhost:6120/touch
   - Admin: http://localhost:6120/admin
   - Display (Web Avatar): http://localhost:6120/display-web-widget
   - Display (Kiosk Pixel Stream): http://localhost:6120/display-kiosk-streaming
     - Requires that you create and Virbe Kiosk Profile  
     - Download and install [Virbe Metahuman Kiosk app](https://docs.virbe.ai/digital-signage/kiosk-apps/metahuman-kiosk)

