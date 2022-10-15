import Dashboard from './dashboard';

// Will redirect to the dashboard only if user is logged in
const Home = () => {
    return <Dashboard />;
};

Home.auth = true;
export default Home;
