function OD360UserStateReader() {
    this.userState;
}

OD360UserStateReader.prototype.setUserState = function(userState) {
    this.userState = userState;
}

OD360UserStateReader.prototype.userId = function() {
    return this.userState.userId;
}

OD360UserStateReader.prototype.realm = function() {
    return this.userState.realm;
}

OD360UserStateReader.prototype.bearerToken = function() {
    return this.userState.bearerToken;
}

OD360UserStateReader.prototype.userProfile = function() {
    return this.userState.userProfile;
}

OD360UserStateReader.prototype.hasRealmRole = function(realmRole) {
    return this.userState.realmAccess.includes(realmRole);
}

OD360UserStateReader.prototype.hasClientRole = function(clientId, clientRole) {
    var exists = false;
    var client = this.userState.resourceAccess.find((c) => c.clientId === clientId);
    if (client) {
        exists = client.roles.includes(clientRole);
    }
    return exists;
}