import "./globals.css";

export const metadata = {
  title: "Meeples in D6",
  description: "Community game nights and event registration.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
