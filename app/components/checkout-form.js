"use client";

import { useState } from "react";
import styles from "../page.module.css";

export default function CheckoutForm() {
  const [amount, setAmount] = useState("10.00");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function startCheckout(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
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
    <form onSubmit={startCheckout}>
      <label className={styles.contributionLabel} htmlFor="contribution-amount">
        Your contribution
      </label>
      <div className={styles.contributionInput}>
        <span aria-hidden="true">$</span>
        <input
          id="contribution-amount"
          type="number"
          min="0"
          max="999999.99"
          step="0.01"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          aria-describedby="contribution-note"
          required
        />
      </div>
      <p className={styles.contributionNote} id="contribution-note">
        $10 suggested. Enter any amount, including $0.
      </p>
      <button
        className={styles.checkoutButton}
        type="submit"
        disabled={loading}
      >
        {loading ? "Opening secure Stripe checkout…" : "Continue to checkout"}
      </button>
      {error && (
        <div className={`${styles.status} ${styles.error}`} role="alert">
          {error}
        </div>
      )}
    </form>
  );
}
