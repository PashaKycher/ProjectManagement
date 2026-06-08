import mongoose from 'mongoose';
import { Schema } from 'mongoose';

const workspaceSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true },
    color: { type: String, defoult: '#FF5733' },
    description: { type: String, trim: true },
    owner: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    projects: [{ type: Schema.Types.ObjectId, ref: 'Project' }],
    members: [
        {
            user: { type: Schema.Types.ObjectId, ref: 'User' },
            role: { type: String, enum: ['admin', 'member', 'owner', 'viewer'], default: 'member' },
            joinedAt: { type: Date, default: Date.now }
        }
    ]
}, { timestamps: true });

const Workspace = mongoose.model('Workspace', workspaceSchema);

export default Workspace;