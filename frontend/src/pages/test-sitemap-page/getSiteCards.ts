import { SiteCard } from './types/SiteCard';
import { Link } from './types/Link';
import { LinkType } from './types/LinkType';

export async function getSiteCards(): Promise<SiteCard[]> {
    const data = [
        new SiteCard(
            1,
            'Main Page',
            [
                new Link(1, 'Header', LinkType.PageContent),
                new Link(2, 'Description', LinkType.PageContent),
                new Link(3, 'About Us', LinkType.Internal),
                new Link(4, 'Start Using Our Product', LinkType.Internal),
                new Link(5, 'Sign In', LinkType.LoginOrRegister),
                new Link(6, 'Sign Out', LinkType.LoginOrRegister),
                new Link(7, 'Our Facebook', LinkType.ExternalLink),
                new Link(8, 'View Premium Features', LinkType.PayedStuff),
            ],
            { x: 900, y: 0 }
        ),
        new SiteCard(
            2,
            'About Us',
            [
                new Link(9, 'TestPageContent1', LinkType.PageContent),
                new Link(10, 'TestPageContent2', LinkType.PageContent),
                new Link(11, 'TestInternal', LinkType.Internal),
                new Link(12, 'TestLoginOrRegister', LinkType.LoginOrRegister),
                new Link(13, 'View Premium Features', LinkType.PayedStuff),
            ],
            { x: 1300, y: 100 }
        ),
    ];

    return new Promise<SiteCard[]>((resolve, reject) => {
        setTimeout(() => {
            resolve(data);
        }, 1000);
    });
}
