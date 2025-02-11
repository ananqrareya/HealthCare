'use client'
import {
    CallControls,
    CallingState,
    ParticipantView, SpeakerLayout,
    StreamCall, StreamTheme,
    StreamVideo,
    StreamVideoClient,
    useCall,
    useCallStateHooks
} from '@stream-io/video-react-sdk';

const apiKey = 'r9xpc8rq9tgq';
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiMjAwIn0.FtmD3xc46q8wYdkrqFmYTl5wYqj25nYs1oQaD5Hs9RI';
const userId = '200';
const callId = 'tLOUbWD3qXMK';
import "@stream-io/video-react-sdk/dist/css/styles.css"

// set up the user object
const user = {
    id: userId,
    name: 'stevan',
    image: 'https://getstream.io/random_svg/?id=oliver&name=Oliver',
};

const client = new StreamVideoClient({ apiKey, user, token });
const call = client.call('default', callId);
call.join({ create: true });



export default function Video() {
    return (
        <div className='bg-[#272a30]'>
            <StreamVideo client={client}>
                <StreamCall call={call}>
                    <MyUILayout />
                </StreamCall>
            </StreamVideo>

        </div>
    );
};



export const MyUILayout = () => {

    const { useCallCallingState, useParticipantCount, useLocalParticipant, useRemoteParticipants } = useCallStateHooks();
    const callingState = useCallCallingState();
    const participantCount = useParticipantCount();
    const localParticipant = useLocalParticipant();
    const remoteParticipants = useRemoteParticipants();

    if (callingState !== CallingState.JOINED) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <StreamTheme>
                <SpeakerLayout participantsBarPosition='bottom' />
                <CallControls onLeave={() => console.log('<Ajdi')} />

            </StreamTheme>
        </div>
    );
};

export const MyParticipantList = () => {
    const call = useCall();
    const participants = call.participants;

    return (
        <div className={{
            display: 'flex',
            flexDirection: 'row',
            gap: '8px',
            width: '100vw',
        }}>
            {participants.map((participant) => (
                <div
                    style={{
                        padding: '8px',
                        borderRadius: '8px',
                        backgroundColor: '#f0f0f0',
                        aspectRatio: '3/2',
                    }}
                    key={participant.user.id}>
                    {participant.user.name}
                </div>
            ))}
        </div>
    );
};

export const MyFloatingLocalParticipant = ({ partisipant }) => {

    return (
        <div
            style={{
                position: 'absolute',
                bottom: '16px',
                right: '16px',
                padding: '8px',
                borderRadius: '8px',
                backgroundColor: '#f0f0f0',
            }}>
            {
                partisipant && <ParticipantView participant={partisipant} />
            }
        </div>
    );
}