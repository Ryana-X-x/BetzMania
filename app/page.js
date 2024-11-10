// pages/index.js
import styles from "../styles/Home.module.css";

const HomePage = () => {
    const games = [
        { image: "/cf.png", title: "Coin Flip", description: "Try your luck flipping a coin!", route: "/coinflip" },
        // { image: "", title: "Dice Roll", description: "Roll the dice and win big!", route: "/dice-roll" },
        // { image: "", title: "Roulette", description: "Bet on numbers, colors, or combinations!", route: "/roulette" },
        { image: "/stake.png", title: "Stake", description: "Beat the dealer in a classic game of blackjack!", route: "/stake" },
    ];

    return (
        <div className={styles.container}>
            <h1><span className={styles.h}>Welcome to</span><img className={styles.image} src="/bet.png" alt="betzmania" /></h1>
            <p className={styles.p}>Choose a game to start playing and test your luck!</p>
            <div className={styles.gameGrid}>
                {games.map((game, index) => (
                    <div key={index} className={styles.card}>
                        <img src={game.image} alt="games" />
                        <h2>{game.title}</h2>
                        <p>{game.description}</p>
                        <a href={game.route} className={styles.playButton}>Play</a>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HomePage;
