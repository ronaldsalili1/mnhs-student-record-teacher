import {
    createBrowserRouter,
    createRoutesFromElements,
    RouterProvider,
    Route,
} from 'react-router-dom';

// Layouts
import Basic from './layouts/Basic';
import Navigation from './layouts/Navigation';

import LoginPage from './containers/LoginPage/LoginPage';

// Student Page
import StudentPage from './containers/StudentPage/StudentPage';

// Subject Page
import SubjectPage from './containers/SubjectPage/SubjectPage';
import SubjectDetailPage from './containers/SubjectDetailPage/SubjectDetailPage';

// Grade Submission
import GradeSubmissionPage from './containers/GradeSubmissionPage/GradeSubmissionPage';
import GradeSubmissionDetailPage from './containers/GradeSubmissionDetailPage/GradeSubmissionDetailPage';

// Profile
import ProfilePage from './containers/ProfilePage/ProfilePage';

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route>
            <Route element={<Basic />}>
                <Route
                    path="/"
                    element={<LoginPage/>}
                />
                <Route
                    path="login"
                    element={<LoginPage/>}
                />
            </Route>
            <Route element={<Navigation/>}>
                <Route
                    path="students"
                    element={<StudentPage/>}
                />
                <Route
                    path="subjects"
                    element={<SubjectPage/>}
                />
                <Route
                    path="grade-submission"
                    element={<GradeSubmissionPage/>}
                />
                <Route
                    path="profile"
                    element={<ProfilePage/>}
                />
            </Route>

            <Route element={<Navigation breadcrumb={true}/>}>
                <Route
                    path="subjects/:subjectId"
                    element={<SubjectDetailPage/>}
                />
                <Route
                    path="grade-submission/create"
                    element={<GradeSubmissionDetailPage/>}
                />
                <Route
                    path="grade-submission/:gradeSubmissionId"
                    element={<GradeSubmissionDetailPage/>}
                />
            </Route>
        </Route>,
    ),
    {
        basename: '/teacher',
    },
);

const App = () => {
    return (
        <RouterProvider router={router} />
    );
};

export default App;