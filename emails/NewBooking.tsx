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

interface KoalaWelcomeEmailProps {
    userFirstname: string;
}

const baseUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : '';

export const KoalaWelcomeEmail = (attendee: AttendeesTable) => (
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
                Hello Den Zali ! Vous avez une nouvelle réservation !
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
                            Vous avez une nouvelle réservation !
                        </Text>
                    </Section>
                    <Section>
                        <Text className="text-lg leading-7 italic">
                            Voici les infos de la réservation :
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

KoalaWelcomeEmail.PreviewProps = {
    userFirstname: 'Alan',
} as KoalaWelcomeEmailProps;

export default KoalaWelcomeEmail;
