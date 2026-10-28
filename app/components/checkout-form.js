"use client";

import { useState } from "react";
import styles from "../page.module.css";

export default function CheckoutForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function startCheckout() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
      });
      const result = await response.json();
      if (!response.ok)
        throw new Error(result.error || "Unable to start checkout.");
      if (!result.url) throw new Error("Stripe did not return a checkout URL.");

      window.location.assign(result.url);
    } catch (checkoutError) {
      setError(checkoutError.message || "Unable to start checkout.");
      setLoading(false);
    }
  }

  return (
    <>
      <button
        className={styles.checkoutButton}
        type="button"
        onClick={startCheckout}
        disabled={loading}
      >
        {loading
          ? "Opening secure Stripe checkout…"
          : "Register now using Stripe"}
      </button>
      {error && (
        <div className={`${styles.status} ${styles.error}`} role="alert">
          {error}
        </div>
      )}
    </>
  );
}
