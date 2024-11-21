import PageContainer from '@/components/layout/page-container';
import WorkoutForm from './workout-form';
import WorkoutViewDetail from './workout-view-detail';
import { fetchWorkoutById } from '../_api';

type WorkoutViewPageProps =
  | {
      mode: 'create';
    }
  | {
      mode: 'view';
      workoutId: string;
    };

export default async function WorkoutViewPage(props: WorkoutViewPageProps) {
  const workoutData = props.mode === 'view' ? await fetchWorkoutById(props.workoutId) : null;

  return (
    <PageContainer>
      {props.mode === 'create' ? <WorkoutForm /> : <WorkoutViewDetail workout={workoutData} />}
    </PageContainer>
  );
}
