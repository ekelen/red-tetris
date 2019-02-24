import { SERVER_PLAYER_DIES } from "../../common/constants";
import { stopGameTimer } from "./update";

export const PLAYER_DIES = 'PLAYER_DIES'


export const playerDies = () => ({type: PLAYER_DIES})
export const serverPlayerDies = () => ({type: SERVER_PLAYER_DIES})