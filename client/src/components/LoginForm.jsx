const LoginForm = ({ onSubmit }) => {

    const handleChange = (e) => {
    };

    return (
        <form onSubmit={onSubmit}>
            <div>
                <input
                    type="password"
                    onChange={handleChange}
                />
            </div>
            <button type="submit" value="validate">Validate</button>
            <button type="submit" value="continue">Continue as Guest</button>
        </form>
    );
};

export default LoginForm;
