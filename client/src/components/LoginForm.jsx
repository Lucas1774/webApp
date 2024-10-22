const LoginForm = ({ onSubmit }) => {

    return (
        <form onSubmit={onSubmit}>
            <div>
                <input
                    type="password"
                />
            </div>
            <button type="submit" value="validate">Validate</button>
            <button type="submit" value="continue">Continue as Guest</button>
        </form>
    );
};

export default LoginForm;
