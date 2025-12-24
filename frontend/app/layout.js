export const metadata = {
  title: 'Mini Ollama Chat',
  description: 'Chat with AI using Ollama',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, fontFamily: 'Arial, sans-serif' }}>
        {children}
      </body>
    </html>
  );
}
