import { useState } from 'react';
import style from './style.module.scss';
import ClassNames from '~/utils/classNames';
const cx = ClassNames(style);

function Video(props) {
    const { className, classerror, src, type, loading, ...rest } = props;
    const [error, setError] = useState(false);
    const [isLoading, setLoadin] = useState(loading || false);
    
    const handleOnError = () => {
        setError(true)
    }

    return (
        <div className={cx("container")}>
            {
                !error ?
                    <iframe
                        onError={handleOnError}
                        src={src}
                        title="Video player"
                        allow="accelerometer;clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen>
                    </iframe>
                    :
                    <span className={[cx("error"), classerror].join(' ')}>Video cannot load!!!</span>

            }
            {/* <iframe
                onError={handleOnError}
                src={src}
                title="Video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen>
            </iframe> */}
        </div>
    );
}

// src="https://www.youtube.com/embed/oE55-SvmR6U"
// https://drive.google.com/file/d/1hy_KRFdLCThwG-CHzPjPwD1RpeM-s52g/preview

export default Video;