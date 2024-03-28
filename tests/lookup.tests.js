var dns = require('dns');
var expect = require('chai').expect;
var evilDNS = require('../evil-dns');

describe('The method hijacking dns.lookup', function () {
  it('returns the family when doing DNS queries', function (done) {
    evilDNS.add('*.foo.com', '1.2.3.4');
    dns.lookup('a.foo.com', {family: undefined, hints: dns.ADDRCONFIG | dns.V4MAPPED}, function (err, addr, family) {
      expect(addr).to.equal('1.2.3.4');
      expect(family).to.equal(4);
      done();
    });
  });

  it('handles family-agnostic queries', function (done) {
    var error = null;
    try {
      dns.lookup('nodejs.org', {family: undefined, hints: dns.ADDRCONFIG | dns.V4MAPPED}, function (err) {
        expect(err).to.not.exist;
        done();
      });
    } catch (err) {
      expect(err).to.not.exist;
      done();
    }
  });

  it('handles queries with the "all" flag', function (done) {
    evilDNS.add('example.com', '1.2.3.4');
    dns.lookup('example.com', { all: true }, function (err, addresses) {
      expect(addresses).to.be.instanceOf(Array);
      expect(addresses).to.have.lengthOf(1);
      const [{ address, family }] = addresses;
      expect(address).to.equal('1.2.3.4');
      expect(family).to.equal(4);
      done();
    });
  });

  afterEach(function () {
    evilDNS.clear();
  });
});
