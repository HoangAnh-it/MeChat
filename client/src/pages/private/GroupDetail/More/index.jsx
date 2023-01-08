import { toast } from 'react-toastify';

import style from './style.module.scss';
import ClassNames from '~/utils/classNames';
import { Button } from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import routes from '~/config/routes'
import api from '~/config/api'
import { useConfirmModal, useAxios } from '~/hooks';
const cx = ClassNames(style);

function More({ members,user, isAdmin, deleteSuccess }) {
    const { id:conversationId } = useParams();
    const navigate = useNavigate()
    const axios = useAxios()
    const [confirmModal_init, openConfirmModal, closeConfirmModal] = useConfirmModal();


    const handleDelete = () => {
        if (members.length <= 3) {
            toast.error('Group must have at least 3 members!')
            return;
        }

        const deleteMember = () => {
            axios.delete(api.deleteUserFromConversation(conversationId, user.id))
                .then(response => {
                    if (response.statusText === 'OK') {
                        toast.success('Delete successfully!')
                        closeConfirmModal()
                        deleteSuccess(response.data)
                    }
                }).catch(err => {
                    console.log(err)
                    toast.error('Cannot delete chat!')
                })
        }

        confirmModal_init(`Delete member?`, `Do you sure to delete ${user.name} from this conversation?`, deleteMember);
        openConfirmModal()
    }

    return ( 
        <div className={cx('container')}>
            <Button
                className={cx('btn')}
                variant="contained"
                onClick={() => navigate(routes.private.toProfile(user.id))}
            >Profile</Button>
            <Button
                className={cx('btn')}
                variant="contained"
                onClick={() => navigate(routes.private.toInbox(user.id))}
            >Message</Button>

            {
                isAdmin &&
                <Button
                    className={cx('btn')}
                    variant="outlined"
                    onClick={handleDelete}
                >Remove</Button>
            }
        </div>
     );
}

export default More;