import { AttendeesTable } from '@/app/lib/definitions';
import {
    Body,
    Button,
    Container,
    Head,
    Hr,
    Html,
    Img,
    Preview,
    Section,
    Tailwind,
    Text,
} from '@react-email/components';
import * as React from 'react';

interface CancelBookingProps {
    userFirstname: string;
}

const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : '';

export const CancelBookingEmail = (attendee: AttendeesTable) => (
    <Tailwind
        config={{
            theme: {
                extend: {
                    colors: {
                        brand: "#007291",
                    },
                },
            },
        }}
    >
        <Html>
            <Head />
            <Preview>
                Hello Den Zali ! Veuillez noter une annulation !
            </Preview>
            <Body className="bg-white font-sans">
                <Container className="mx-auto p-5">
                    <Section className="text-center">
                    </Section>
                    <Section>
                        <Text className="text-xl leading-7 font-bold">
                            Salut l'équipe Den Zali,
                        </Text>
                        <Text className="text-lg leading-7 font-semibold">
                            Un des élèves a annulé sa réservation !
                        </Text>
                    </Section>
                    <Section>
                        <Text className="text-lg leading-7 italic">
                            Voici les infos :
                        </Text>
                        <Text className="text-sm leading-7">
                            Nom de la classe : {attendee.classe_name}
                        </Text>
                        <Text className="text-sm leading-7">
                            Date de la classe : {attendee.classe_date}
                        </Text>
                        <Text className="text-sm leading-7">
                            Nom de la personne : {attendee.user_name}
                        </Text>
                        <Text className="text-sm leading-7">
                            Produit : {attendee.product}
                        </Text>
                    </Section>
                    <Hr className="border-gray-300 my-5" />
                </Container>
            </Body>
        </Html>
    </Tailwind>
);

CancelBookingEmail.PreviewProps = {
    userFirstname: 'Fanfan',
} as CancelBookingProps;

export default CancelBookingEmail;
