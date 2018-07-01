let expect = chai.expect;
import client from '../src/client';

describe('client', () => {
    test('client', () => {
        client({
            uri: 'ws://localhost:3100',
        }, function (err, doc) {
            if(err) console.error(err.stack);
            expect(doc).to.be.an('object');
            doc.on('open', function () {
                doc.request('/', function (err, doc) {
                    console.log(doc);
                });
            });
        });
    });
});