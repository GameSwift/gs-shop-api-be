import { createTestApp } from '../utils/test.helpers';
import { OauthService } from './oauth.service';

describe.skip('OauthService', () => {
    let service: OauthService;

    beforeEach(async () => {
        const module = await createTestApp();

        service = module.get<OauthService>(OauthService);
    });

    it('should get 404 from api', async () => {
        const result = await service.getAccessTokenData('abcd');
        expect(result).toEqual(null);
    });
});
