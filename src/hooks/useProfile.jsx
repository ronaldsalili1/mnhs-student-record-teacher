import { useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import { get, patch } from '../helpers/request';
import { NavigationContext } from '../providers/NavigationProvider';
import { AuthContext } from '../providers/AuthProvider';

const useProfile = () => {
    const [meta, setMeta] = useState(null);
    const [loadingProfile, setLoadingProfile] = useState(false);
    const [profile, setProfile] = useState(null);
    const [loadingSubmit, setLoadingSubmit] = useState(false);
    const [loadingChangePass, setLoadingChangePass] = useState(false);

    const layoutState = useContext(NavigationContext);
    const { notificationApi } = layoutState;
    const { setTeacher, teacher } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    const resetMeta = () => {
        setMeta(null);
    };

    const getProfile = async (query) => {
        setLoadingProfile(true);

        const response = await get({ uri: '/teacher/profile', query, navigate, location });
        if (response?.meta?.code !== 200) {
            setMeta(response?.meta);
            setLoadingProfile(false);
            return;
        }

        setProfile(response?.data?.profile);
        setLoadingProfile(false);
    };

    const updateProfile = async ({ fields }) => {
        setLoadingSubmit(true);

        const body = {
            profile: {
                ...fields,
            },
        };

        const response = await patch({
            uri: '/teacher/profile',
            body,
            navigate,
            location,
        });

        if (response?.meta?.code !== 200) {
            setMeta(response?.meta);
            setLoadingSubmit(false);
            return;
        }

        setMeta(response.meta);
        setProfile(response?.data?.profile);
        setTeacher({
            ...teacher,
            ...response?.data?.profile,
        });
        setLoadingSubmit(false);
    };

    const changePassword = async ({ fields }) => {
        setLoadingChangePass(true);

        const body = {
            profile: {
                ...fields,
            },
        };

        const response = await patch({
            uri: '/teacher/profile/change-password',
            body,
            navigate,
            location,
        });

        if (response?.meta?.code !== 200) {
            setMeta(response?.meta);
            setLoadingChangePass(false);
            return;
        }

        setMeta(response.meta);
        setLoadingChangePass(false);
    };

    useEffect(() => {
        getProfile();

        return () => {
            setProfile(null);
            setMeta(null);
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        if (meta) {
            const type = (meta.code === 200) ? 'success' : 'error';
            notificationApi[type]({
                message: meta.message,
                placement: 'bottomRight',
            });

            if (meta.code === 200) {
                getProfile();
            }
        }

        return () => resetMeta();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [meta]);

    return {
        meta,
        resetMeta,
        getProfile,
        loadingProfile,
        profile,
        updateProfile,
        loadingSubmit,
        changePassword,
        loadingChangePass,
    };
};

export default useProfile;