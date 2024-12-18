# **TwitchTitle**

Automate and update your Twitch stream titles programmatically.

---

## **Features**
- Update your Twitch stream title dynamically.
- Supports API and Chrome Extension workflows.
- Integrates seamlessly with Twitch's API.

---

## **Setup**

1. **Clone the repository**:
   ```bash
   git clone https://github.com/adnjoo/twitchtitle.git
   cd twitchtitle
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Set up environment variables**:
   - Create a `.env` file and add the following:
     ```
     NEXT_PUBLIC_TWITCH_CLIENT_ID=your_client_id
     TWITCH_CLIENT_SECRET=your_client_secret
     NEXT_PUBLIC_SUPABASE_URL=..
     NEXT_PUBLIC_SUPABASE_ANON_KEY=..

     PUPPETEER_EXECUTABLE_PATH=..
     ```

4. **Run the app**:
   ```bash
   npm run dev
   ```

---

## **Usage**

1. Visit the app in your browser: `http://localhost:3000`.
2. Log in with your Twitch account.
3. Use the provided tools to update your stream title programmatically.

---

## **Tech Stack**
- **Next.js**
- **Supabase** (for authentication)
- **Twitch API**

---

## **License**
This project is open-source under the [MIT License](LICENSE).

---

## **Contributing**
Feel free to open issues or submit pull requests.

