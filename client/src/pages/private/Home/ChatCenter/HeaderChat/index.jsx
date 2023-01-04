import UserItem from "~/components/UserItem";
import More from './More';

import style from './style.module.scss';
import ClassNames from '~/utils/classNames';
const cx = ClassNames(style);

function HeaderChat(props) {
    const { className, userChatting } = props;
    return (
        <div className={[cx('container'), className].join(' ')}>
            <UserItem
                className={cx('partner')}
                // More={<More />}
                data={userChatting}
            />
        </div>
    );
}

export default HeaderChat;