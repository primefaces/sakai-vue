import { toRefs, reactive } from 'vue';

const appConfig = reactive({
    ripple: false,
    darkTheme: false,
    inputStyle: 'outlined',
    menuMode: 'static',
    theme: 'lara-light-indigo',
    scale: 14
});

const layoutState = reactive({
    staticMenuDesktopInactive: false,
    overlayMenuActive: false,
    profileSidebarVisible: false,
    configSidebarVisible: false,
    staticMenuMobileActive: false,
    menuHoverActive: false
});

export function useThemeService () {
    const changeThemeSettings = (theme, darkTheme) => {
        appConfig.theme = theme;
        appConfig.darkTheme = darkTheme;
    };

    const setScale = scale => {
        appConfig.scale = scale;
    };

    const onMenuToggle = () => {
        debugger;
        if (appConfig.menuMode === 'overlay') {
            layoutState.overlayMenuActive = !layoutState.overlayMenuActive;
            /*  if (layoutState.overlayMenuActive) {
                this.overlayOpen.next(null);
            } */
        }

        if (window.innerWidth > 991) {
            layoutState.staticMenuDesktopInactive = !layoutState.staticMenuDesktopInactive;
        } else {
            layoutState.staticMenuMobileActive = !layoutState.staticMenuMobileActive;

            /*  if (this.state.staticMenuMobileActive) {
                this.overlayOpen.next(null);
            } */
        }
    };

    return { appConfig: toRefs(appConfig), layoutState: toRefs(layoutState), changeThemeSettings, setScale, onMenuToggle };
}
