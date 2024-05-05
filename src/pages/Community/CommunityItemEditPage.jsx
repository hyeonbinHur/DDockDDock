import { useFirestore } from '../../hooks/useFirestore';
import { useDispatch, useSelector } from 'react-redux';
import { useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDocument } from '../../api/getDocument';
import { readItem } from '../../store/ItemSlice';
import { getSydneyTimeISO } from '../../util/formDate';

import MarketItemEditForm from '../../components/MarketItem/MarketItemEditForm';
import ItemModal from '../../components/Modal/ItemStatusModal';

import { updateItemInCollection } from '../../store/communityCollectionSlice';

export default function HouseItemEditPage() {
    const { cItemId } = useParams();

    const { updateDocument, response, loading } = useFirestore('CommunityItem');
    const modal = useRef();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const reduxItem = useSelector((state) => state.itemInRedux.item);

    useEffect(() => {
        if (cItemId) {
            const fetchData = async () => {
                try {
                    const data = await getDocument('CommunityItem', cItemId);
                    dispatch(readItem({ item: data }));
                } catch (error) {
                    console.error(error);
                }
            };
            fetchData();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch]);

    const doEditDocument = async (title, conditions, description, images) => {
        modal.current.open();
        const createdAt = getSydneyTimeISO();
        const updatedItem = {
            title: title,
            description: description,
            conditions: conditions,
            comments: reduxItem.comments,
            images: images,
            bucket: reduxItem.bucket,
            location: reduxItem.location,
            createdAt: createdAt,
            userId: reduxItem.userId,
            type: 'C_Item',
            interests: reduxItem.interests,
            numOfComment: reduxItem.numOfComment,
        };

        dispatch(updateItemInCollection({ item: updatedItem, id: cItemId }));
        await updateDocument(cItemId, updatedItem, 'CommunityItem');
    };

    return (
        <>
            {reduxItem && (
                <div>
                    <ItemModal
                        ref={modal}
                        response={response}
                        loading={loading}
                        navigate={navigate}
                        from={'Community'}
                    />
                    <MarketItemEditForm
                        doAction={doEditDocument}
                        item={reduxItem}
                        response={response}
                    />
                </div>
            )}
        </>
    );
}
