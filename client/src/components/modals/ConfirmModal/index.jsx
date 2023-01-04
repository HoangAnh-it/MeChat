import { useConfirmModal } from '~/hooks'; 

import style from './style.module.scss';
import ClassNames from '~/utils/classNames';
import Button from '~/components/Button';
const cx = ClassNames(style);

function ConfirmModal(className) {
    const [init, open, close, state] = useConfirmModal();

    const cancel =  () => {
        close();
    }

    return (
        state.isActive &&
        <div id="modal">
            <div className={[className, cx('container')].join(' ')}>
                    <h1 className={cx('title')}>{state.title}</h1>
                    <div className={cx('description')}>{state.description}</div>
                    <div className={cx('actions')}>
                        <Button
                            className={cx('btn')}
                            onClick={cancel}
                        >Cancel</Button>
                        <Button
                            className={cx('btn', 'confirm')}
                            primary
                            onClick={state.action}
                        >Confirm</Button>
                    </div>
            </div>
        </div>
    );
}

export default ConfirmModal;