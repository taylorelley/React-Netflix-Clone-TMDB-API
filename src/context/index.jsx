import ThemeContextProvider from './ThemeContext';
import UserContextProvider from './UserContext';

/**
 * Combines all context providers into a single wrapper.
 */
export default function CombinedContextProvider(props) {
    return(
        <ThemeContextProvider>
            <UserContextProvider>
                {props.children}
            </UserContextProvider>
        </ThemeContextProvider>
    )
}