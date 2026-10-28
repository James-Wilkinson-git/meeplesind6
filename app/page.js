import Link from "next/link";
import Image from "next/image";
import styles from "./page.module.css";
import CheckoutForm from "./components/checkout-form";
import { eventData } from "./event-data";

export const metadata = {
  title: "Meeples in D6 | Game Night Registration",
  description: "Reserve your seat for game night at Meeples in D6.",
};

export default function HomePage() {
  return (
    <main className={styles.shell}>
      <header className={styles.header}>
        <Link
          className={styles.wordmark}
          href="/"
          aria-label="Meeples in D6 home"
        >
          <span className={styles.logoCrop} aria-hidden="true">
            <Image
              className={styles.headerLogo}
              src="/meeplesD6.svg"
              alt=""
              width={612}
              height={792}
            />
          </span>
          <span>
            Meeples <span className={styles.wordmarkLight}>in D6</span>
          </span>
        </Link>
        <span className={styles.headerNote}>A seat at the table</span>
      </header>

      <div className={styles.content}>
        <section
          className={styles.event}
          id="registration"
          aria-labelledby="event-title"
        >
          <Image
            className={styles.eventImage}
            src="/meeplesind6poster.webp"
            alt="Meeples in D6 board game days poster featuring the venue, dice, and meeple logo"
            width={4032}
            height={2268}
            loading="eager"
            sizes="(max-width: 780px) 100vw, 1160px"
          />
          <div className={styles.eventCopy}>
            <p className={styles.eyebrow}>
              <span className={styles.dot} /> Community game night
            </p>
            <h1 id="event-title">Calling all board game enthusiasts!</h1>
            <p className={styles.description}>
              Whether you&apos;re a strategic mastermind or just love a good
              game day with friends, Meeples in D6 is the place to be. Spend a
              full day immersed in tabletop gaming, meet fellow gamers, and
              discover new favorites.
            </p>
            <p className={styles.description}>
              We have so many new titles for you to explore, including some that
              have not even arrived yet.
            </p>
            <div className={styles.eventCheckout}>
              <CheckoutForm />
              <p className={styles.eventPaymentNote}>
                Secure payment powered by Stripe
              </p>
            </div>
          </div>
        </section>

        <section className={styles.information} aria-label="Event information">
          <section className={styles.infoSection}>
            <p className={styles.eyebrow}>Find your table</p>
            <h2>Who is it for?</h2>
            <p>
              Our events are geared towards hobby board gamers who enjoy
              strategic thinking, from relaxing short games to long, three-hour
              brain burners. We offer a laid-back, lower-noise environment.
              These events are not aimed at beginners or people looking
              primarily for party games.
            </p>
          </section>

          <section className={styles.infoSection}>
            <p className={styles.eyebrow}>This month</p>
            <h2>Game library</h2>
            <p>
              This month we&apos;re featuring new releases and spooky titles for
              Halloween.
            </p>
            <div className={styles.gameLists}>
              <div>
                <h3>New releases</h3>
                <ul>
                  {eventData.newReleases.map((game) => (
                    <li key={game}>{game}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3>Spooky vibes</h3>
                <ul>
                  {eventData.spookyGames.map((game) => (
                    <li key={game}>{game}</li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          <div className={styles.infoColumns}>
            <section className={styles.infoSection}>
              <p className={styles.eyebrow}>Good to know</p>
              <h2>Costumes</h2>
              <p>
                It&apos;s Halloween! Feel free to dress up. Bonus points for
                board-game-themed costumes.
              </p>
            </section>
            <section className={styles.infoSection}>
              <p className={styles.eyebrow}>Admission</p>
              <h2>Pay what you can</h2>
              <p>
                A $10 contribution is suggested to help cover event costs. Pay
                what works for you, including $0, when you register.
              </p>
            </section>
            <section className={styles.infoSection}>
              <p className={styles.eyebrow}>For later</p>
              <h2>Bring and buy</h2>
              <p>
                We&apos;re not quite big enough to host one yet, but we hope to
                in the future.
              </p>
            </section>
            <section className={styles.infoSection}>
              <p className={styles.eyebrow}>Food and drink</p>
              <h2>Refreshments</h2>
              <p>
                Coke Zero and candy bars are available for a $1 donation. There
                are lots of lunch and dinner options nearby, as well as delivery
                to the lobby.
              </p>
            </section>
          </div>

          <section className={styles.infoSection}>
            <p className={styles.eyebrow}>Plan ahead</p>
            <h2>Getting there</h2>
            <p>
              The event is in a large private condo party room. Only registered
              attendees can enter, so please register ahead of time. If you plan
              to donate at the door instead, RSVP on AfterGame so we can plan
              the room setup.
            </p>
            <div className={styles.travelColumns}>
              <div>
                <h3>By TTC</h3>
                <p>
                  College, Wellesley, and Sherbourne stations are about 1 km
                  away. Nearby service includes the 511 Carlton streetcar,
                  Sherbourne streetcar stops, and the Sherbourne bus.
                </p>
              </div>
              <div>
                <h3>Driving and parking</h3>
                <p>
                  The closest major intersection is Jarvis and Carlton. Limited
                  free parking is available at the venue. Nearby street parking
                  and Green P on Sherbourne are usually the cheapest options.
                </p>
              </div>
            </div>
          </section>

          <section className={styles.infoSection}>
            <p className={styles.eyebrow}>At the venue</p>
            <h2>Accessibility and entrance</h2>
            <p>
              The venue is wheelchair accessible, with outdoor space for a
              sensory break and a smaller library next to the room. Toronto
              automatic door buttons are sometimes out of order; message James
              for assistance or other accommodations.
            </p>
            <p>
              My partner will be at the condo door for the first hour. After
              that, you&apos;ll need a cellphone to call security; entry can
              take up to 10 minutes, so plan accordingly. You can also text
              James using the number posted at the door.
            </p>
          </section>

          <section className={styles.infoSection}>
            <p className={styles.eyebrow}>Please read</p>
            <h2>Rules and ticket safety</h2>
            <p>
              <Link
                className={styles.textLink}
                href="https://docs.google.com/document/d/1QCeSbLdorOb_xr2qszt0Ke-L7VcMGqsdhOjGnQY3aF0/edit?usp=sharing"
                target="_blank"
                rel="noreferrer"
              >
                Read the event rules
              </Link>
            </p>
            <p className={styles.fraudAlert}>
              <strong>Fraud alert:</strong> No one is reselling tickets; resale
              ads are fake. Official communications come only from James
              Wilkinson, Board Gaymes James, or Meeples in D6 accounts.
            </p>
          </section>
        </section>
      </div>

      <footer className={styles.footer}>
        <span>Meeples in D6</span>
        <span>Come for the games. Stay for the people.</span>
      </footer>
    </main>
  );
}
