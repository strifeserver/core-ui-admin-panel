/* eslint-disable */
import { queryAPI, queryWhereAPI, createAPI, updateAPI, deleteAPI } from './Function'
import { campaignList, campaignInit, campaignLoad, campaignProcess, campaignListPaginated } from './Store'

export function campaignListProcess(arg) {
    return async function(dispatch) {
        const response = await queryAPI('campaign')
        return dispatch(campaignList(response))
    };
}

export function listProcess(arg) {
    return async function(dispatch) {
        const response = await queryAPI('campaign')
        return dispatch(campaignList(response))
    };
}

export function listProcessPaginated(page, data, limit) {
    return async function(dispatch) {
        const response = await queryAPI(`campaign?page=${page}&filter=${data}&itemsPerPage=${limit}&pagination=1`)
        return dispatch(campaignListPaginated(response))
    };
}

export function initProcess(arg) {
    return async function(dispatch) {
        return dispatch(campaignInit({}))
    };
}

export function loadProcess(arg) {
    return async function(dispatch) {
        const response = await queryAPI('campaign/' + arg + '/edit') 
        return dispatch(campaignLoad(response))
    };
}

export function createProcess(arg) {
    return async function(dispatch) {
        const response = await createAPI({name:"campaign", data:arg})
        return dispatch(campaignProcess(response))
    };
}

export function updateProcess(arg) {
    return async function(dispatch) {
        const response = await updateAPI({name:"campaign", data:arg})
        return dispatch(campaignProcess(response))
    };
}

export function deleteProcess(arg) {
    return async function(dispatch) {
        const response = await deleteAPI({name:"campaign", data:arg})
        return dispatch(campaignProcess(response))
    };
}