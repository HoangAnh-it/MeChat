import React from 'react'

import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';

import { SearchIcon } from '~/components/Icon';
import { useAxios, useAuth } from '~/hooks';
import More from './More'
import api from '~/config/api';
import style from './style.module.scss';
import ClassNames from '~/utils/classNames';
import UserItem from '~/components/UserItem';
import { toast } from 'react-toastify';
import Loading from '~/components/Loading';
import { Button } from '@mui/material';
const cx = ClassNames(style);

const LIMIT_USER = 10;

function Friends() {
    const [search, setSearch] = React.useState('');
    const [users, setUsers] = React.useState([]);
    const [loading, setLoading] = React.useState(false)
    const axios = useAxios();
    const [auth] = useAuth()

    const fetch = (skip, inserted = false) => {
        setLoading(true)

        if (inserted) {
            if (users.length % LIMIT_USER !== 0) {
                console.log('no-data')
                setLoading(false)
                return;
            }
        }

        axios.get(api.findFriends(search.trim(), {
            limit: LIMIT_USER,
            skip: skip
        }))
            .then(res => {
                if (res.statusText === 'OK') {
                    const data = res.data.map(d => ({
                        id: d.id,
                        name: d.name,
                        avatar: d.avatar,
                        intro: `${d.email || '[no email]'} - ${d.phoneNumber || '[no phone]'}`
                    }))
                    setTimeout(() => {
                        if (!inserted) {
                            setUsers(data);
                        } else {
                            setUsers(u => ([
                                ...u,
                                ...data
                            ]))
                        }
                        setLoading(false)
                    }, 1200);
                }
            }).catch(err => {
                console.log(err)
                toast.error('Cannot find...')
                setLoading(false)
            })
    }

    const handleSearch = () => {
        if (!search) return;
        fetch(0)
    }

    const handleLoadMore = () => {
        fetch(users.length, true);
    }

    return (
        <div className={cx('container')}>
            <h1 className={cx('title')}>Find new friends</h1>
            <FormControl
                sx={{ m: 1 }}
                variant="outlined"
                className={cx('input')}
            >
                <InputLabel
                    htmlFor="outlined-adornment-password"
                    className={cx('title')}
                >Search (email, phone, name)</InputLabel>
                <OutlinedInput
                    className={cx('content')}
                    id="outlined-adornment-password"
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            handleSearch()
                        }
                    }}
                    onChange={(e) => { setSearch(e.target.value) }}
                    value={search}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                                aria-label="toggle password visibility"
                                edge="end"
                                className={cx('icon-search')}
                                onClick={handleSearch}
                            >
                                <SearchIcon />
                            </IconButton>
                        </InputAdornment>
                    }
                    label="Password"
                />
            </FormControl>
            <div className={cx('list')}>
                {
                    loading && <Loading className={cx('loading')} />
                }
                {
                        users.length > 0 ?
                            <>
                                {
                                    users.map((user, index) => {
                                        return (
                                            <UserItem
                                                key={`friends-${user.id}-index-${index}`}
                                                className={cx('item')}
                                                data={user}
                                                More={
                                                    auth.user.id === user.id ?
                                                        <span className={cx('user-item-me')}>You</span>
                                                        :
                                                        <More user={user} />
                                                }
                                            />
                                        )
                                    })
                                }

                                {
                                    users.length % LIMIT_USER === 0 &&
                                    <Button className={cx('btn-load-more')}
                                            onClick={handleLoadMore}
                                    >Load more</Button>
                                }
                            </>
                            :
                            <div className={cx('no-data')}>No data</div>
                }

            </div>
        </div>
    );
}

export default Friends;