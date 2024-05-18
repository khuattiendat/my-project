import {useEffect} from "react";

const DialogFlow = () => {
    useEffect(() => {
            window.addEventListener('dfMessengerLoaded', function (event) {
                const df1 = document.querySelector("df-messenger");
                const df2 = df1.shadowRoot.querySelector("df-messenger-chat");

                const sheet = new CSSStyleSheet;
                sheet.replaceSync(`div.chat-wrapper[opened="true"] { height: 80% }`);
                df2.shadowRoot.adoptedStyleSheets = [sheet];
            });

        }, []
    )
    ;
    return (
        <div>
            {/*<df-messenger*/}
            {/*    className="messenger"*/}
            {/*    intent="WELCOME"*/}
            {/*    chat-title="Chat với chúng tôi"*/}
            {/*    agent-id="40362314-94ca-4979-b748-eae0fef908e9"*/}
            {/*    language-code="vi"*/}
            {/*    chat-icon={"https://www.google.com/images/branding/product/1x/assistant_96dp.png"}*/}
            {/*></df-messenger>*/}
            <df-messenger
                className="messenger"
                intent="WELCOME"
                chat-title="Chat với chúng tôi"
                agent-id="40362314-94ca-4979-b748-eae0fef908e9"
                language-code="vi"
                chat-icon={"/images/chatbot_icon.png"}
            ></df-messenger>
        </div>
    )
}
export default DialogFlow;