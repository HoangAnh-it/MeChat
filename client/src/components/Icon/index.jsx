import {forwardRef} from 'react'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faUser,
    faLock,
    faPen,
    faPhone,
    faPhoneSlash,
    faCircleExclamation,
    faMagnifyingGlass,
    faEllipsisVertical,
    faPaperPlane,
    faVideo,
    faXmark,
    faUserPlus,
    faCommentDots,
    faMessage,
    faAngleUp,
    faEnvelope,
    faMicrophone,
    faMicrophoneSlash,
    faBell,
    faFaceSmile,
    faImages,
    faRightToBracket,
} from "@fortawesome/free-solid-svg-icons";
import { faFacebook, faGooglePlus } from '@fortawesome/free-brands-svg-icons';
import Tippy from '@tippyjs/react';
import style from './style.module.scss';
import ClassNames from '~/utils/classNames';
const cx = ClassNames(style);

function TippyWrapper({tooltip, children}) {
    const hidden = !tooltip || Object.keys(tooltip).length === 0;
    const classes = cx({
        hidden: hidden
    })
    return (
        <Tippy {...tooltip} className={classes}>
            {children}
        </Tippy>
    )
}

function CreateIcon(icon) {
    const Icon = ({ className, tooltip, onClick }, ref) => {
        return (
            <TippyWrapper tooltip={tooltip}>
                <div className={[cx('container'), className].join(' ')} onClick={onClick} ref={ref}>
                    <FontAwesomeIcon icon={icon} />
                </div>
            </TippyWrapper>
        );
    }

    return forwardRef(Icon);
}

export const UserIcon = CreateIcon(faUser);
export const LockIcon = CreateIcon(faLock);
export const PenIcon = CreateIcon(faPen);
export const PhoneIcon = CreateIcon(faPhone);
export const ErrorIcon = CreateIcon(faCircleExclamation);
export const SearchIcon = CreateIcon(faMagnifyingGlass);
export const MoreIcon = CreateIcon(faEllipsisVertical);
export const SendIcon = CreateIcon(faPaperPlane);
export const VideoIcon = CreateIcon(faVideo);
export const FacebookIcon = CreateIcon(faFacebook);
export const GoogleIcon = CreateIcon(faGooglePlus);
export const CloseIcon = CreateIcon(faXmark);
export const UserPlusIcon = CreateIcon(faUserPlus);
export const MessageIcon = CreateIcon(faCommentDots);
export const AngleUpIcon = CreateIcon(faAngleUp);
export const MailIcon = CreateIcon(faEnvelope);
export const MicrophoneOpenIcon = CreateIcon(faMicrophone)
export const MicrophoneCloseIcon = CreateIcon(faMicrophoneSlash)
export const ChatIcon = CreateIcon(faMessage);
export const PhoneSlashIcon = CreateIcon(faPhoneSlash);
export const NotificationIcon = CreateIcon(faBell);
export const EmojiIcon = CreateIcon(faFaceSmile);
export const MediaUploadIcon = CreateIcon(faImages);
export const LogoutIcon = CreateIcon(faRightToBracket);