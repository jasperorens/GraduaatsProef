import React from "react";
import {Content, DisplayStyle} from "./styles.js";
import { StyleSheetManager } from 'styled-components';
const Layout = ({ children }) => {
    return (
        <StyleSheetManager>
            <DisplayStyle>
                <Content>
                    {children}
                </Content>

            </DisplayStyle>
        </StyleSheetManager>
    )

}

export default Layout;
