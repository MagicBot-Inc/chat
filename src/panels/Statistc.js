import React, {useState} from 'react';
import PropTypes from 'prop-types';
import { platform, IOS } from '@vkontakte/vkui';
import Panel from '@vkontakte/vkui/dist/components/Panel/Panel';
import PanelHeader from '@vkontakte/vkui/dist/components/PanelHeader/PanelHeader';
import HeaderButton from '@vkontakte/vkui/dist/components/HeaderButton/HeaderButton';
import Icon28ChevronBack from '@vkontakte/icons/dist/28/chevron_back';
import Icon24Back from '@vkontakte/icons/dist/24/back';
import Cell from "@vkontakte/vkui/dist/components/Cell/Cell";
import Avatar from "@vkontakte/vkui/dist/components/Avatar/Avatar";
import FixedLayout from "@vkontakte/vkui/dist/components/FixedLayout/FixedLayout";



const osName = platform();

const Statistic = ({id,go,fetchedUser}) =>{
    const [count,setCount] = useState(0);
    return(

        <Panel id={id}>
            <PanelHeader
                left={<HeaderButton onClick={go} data-to="home">
                    {osName === IOS ? <Icon28ChevronBack/> : <Icon24Back/>}
                </HeaderButton>}
            >
                Статистика
            </PanelHeader>
            <FixedLayout vertical="top" style={{marginTop:10}}>
                {fetchedUser &&
                <Cell
                    style={{background:'var(--background_page)'}}
                    before={fetchedUser.photo_200 ? <Avatar src={fetchedUser.photo_200}/> : null}
                    description={`Вы написали ${count} символов`}>
                    {`${fetchedUser.first_name} ${fetchedUser.last_name}`}
                </Cell>
                }
            </FixedLayout>
        </Panel>
    );
}

Statistic.propTypes = {
    id: PropTypes.string.isRequired,
    go: PropTypes.func.isRequired,
    fetchedUser: PropTypes.shape({
        photo_200: PropTypes.string,
        first_name: PropTypes.string,
        last_name: PropTypes.string,
        city: PropTypes.shape({
            title: PropTypes.string,
        }),
    }),
};

export default Statistic;
