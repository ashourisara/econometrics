import FixedIncomeDisplay from "../components/FixedIncomeDisplay";
import styles from "../styles/Home.module.css";

export default function Home() {
  return (
    <div className={styles.container}>
      <main className={styles.main}>
        <FixedIncomeDisplay />
      </main>
    </div>
  );
}
