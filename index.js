import React, {PureComponent} from "react";
import {
    Animated,
    Dimensions,
    Keyboard,
    Platform,
    ScrollView,
    StyleSheet,
    TextInput,
    UIManager,
    View
} from "react-native";
import PropTypes from 'prop-types';

const {State: TextInputState} = TextInput;

InteractionKeyboard.prototype = {
    contentContainerStyle: PropTypes.any,
    scrollRefs: PropTypes.func,
    usingScrollView: PropTypes.bool
};

InteractionKeyboard.defaultProps = {
    usingScrollView: true
};

export default class InteractionKeyboard extends PureComponent {
    state = {
        shift: new Animated.Value(0),
        bottom: 0
    };
    keyboardDidShowSub;
    keyboardDidHideSub;

    componentDidMount() {
        this.keyboardDidShowSub = Keyboard.addListener(
            "keyboardDidShow",
            this.handleKeyboardDidShow
        );
        this.keyboardDidHideSub = Keyboard.addListener(
            Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
            this.handleKeyboardDidHide
        );
    }

    componentWillUnmount() {
        this.keyboardDidShowSub.remove();
        this.keyboardDidHideSub.remove();
    }

    scrollView;
    scrollY = 0;

    render() {
        return (
            <View style={styles.container}>
                {this.props.usingScrollView ? (
                    <ScrollView
                        onScroll={event => {
                            this.scrollY = event.nativeEvent.contentOffset.y;
                        }}
                        scrollEventThrottle={1}
                        ref={ref => {
                            this.scrollView = ref;
                            this.props.scrollRefs && this.props.scrollRefs(ref);
                        }}
                        alwaysBounceVertical={false}
                        keyboardShouldPersistTaps="handled"
                        keyboardDismissMode="interactive"
                        contentContainerStyle={this.props.contentContainerStyle}
                    >
                        {this.props.children}
                        <View
                            style={{height: Platform.OS === "ios" ? this.state.bottom : 0}}
                        />
                    </ScrollView>
                ) : (
                    this.props.children
                )}
            </View>
        );
    }

    scrollYBefore;
    isHideKeyboard;
    handleKeyboardDidShow = event => {
        try {
            if (!this.scrollView) {
                return;
            }
            const keyboardHeight = event.endCoordinates.height;
            this.setState({
                bottom: keyboardHeight
            });
            const {height: windowHeight} = Dimensions.get("window");
            const currentlyFocusedField = TextInputState.currentlyFocusedField();
            UIManager.measure(
                currentlyFocusedField,
                (originX, originY, width, height, pageX, pageY) => {
                    const fieldHeight = height;
                    const fieldTop = pageY;
                    const gap = windowHeight - keyboardHeight - (fieldTop + fieldHeight);
                    if (gap >= 0) {
                        return;
                    }
                    const y =
                        this.scrollY +
                        keyboardHeight -
                        (windowHeight - pageY) +
                        40;
                    this.scrollYBefore = this.scrollY;
                    this.scrollView.scrollTo({
                        x: 0,
                        y,
                        animated: true
                    });
                }
            );
        } catch (e) {
            this.handleKeyboardDidHide();
        }
    };
    handleKeyboardDidHide = () => {
        this.isHideKeyboard = true;
        if (this.scrollView && Platform.OS === "ios") {
            this.scrollView.scrollTo({
                x: 0,
                y: 0,
                animated: true
            });
        }
        this.setState({
            bottom: 0
        });
    };

    componentDidUpdate() {
        if (this.scrollYBefore && this.isHideKeyboard) {
            this.isHideKeyboard = false;
            setTimeout(() => {
                this.scrollY = this.scrollYBefore;
                this.scrollView.scrollTo({
                    x: 0,
                    y: this.scrollY,
                    animated: true
                });
            }, 0);
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});
