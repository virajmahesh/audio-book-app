import React from "react";
import {withNavigation} from 'react-navigation';

import AuthSessionManager from "./AuthSessionManager";

@withNavigation
class AuthPage extends React.Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props);
    }

    async componentDidMount() {
        await AuthSessionManager.fetchNewAccessToken();
    }


    render() {
        return null;
    }

}

export default AuthPage;